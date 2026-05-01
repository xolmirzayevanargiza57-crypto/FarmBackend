const Flock = require('../models/Flock');
const EggProduction = require('../models/EggProduction');
const FeedRecord = require('../models/FeedRecord');
const HealthRecord = require('../models/HealthRecord');
const SalesRecord = require('../models/SalesRecord');
const Expense = require('../models/Expense');

const getAIAdvice = async (req, res) => {
    try {
        // Collect real farm data
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        const [flocks, recentEggs, recentFeed, recentHealth, monthlySales, monthlyExpenses] = await Promise.all([
            Flock.find({ status: 'active' }),
            EggProduction.find({ date: { $gte: last7Days } }).populate('flockId', 'name'),
            FeedRecord.find({ date: { $gte: last7Days } }).populate('flockId', 'name'),
            HealthRecord.find().sort({ date: -1 }).limit(10).populate('flockId', 'name'),
            SalesRecord.aggregate([
                { $match: { date: { $gte: startOfMonth } } },
                { $group: { _id: null, total: { $sum: '$totalAmount' }, count: { $sum: 1 } } }
            ]),
            Expense.aggregate([
                { $match: { date: { $gte: startOfMonth } } },
                { $group: { _id: '$category', total: { $sum: '$amount' } } }
            ])
        ]);

        const totalBirds = flocks.reduce((s, f) => s + f.quantity, 0);
        const totalEggs7d = recentEggs.reduce((s, e) => s + e.eggsCollected, 0);
        const totalBroken7d = recentEggs.reduce((s, e) => s + (e.brokenEggs || 0), 0);
        const totalFeedCost7d = recentFeed.reduce((s, f) => s + (f.totalCost || 0), 0);
        const totalFeedKg7d = recentFeed.reduce((s, f) => s + (f.quantityKg || 0), 0);
        const monthRevenue = monthlySales[0]?.total || 0;
        const monthExpTotal = monthlyExpenses.reduce((s, e) => s + e.total, 0);
        const profit = monthRevenue - monthExpTotal;

        const mortalityRecords = recentHealth.filter(h => h.recordType === 'mortality');
        const totalMortality = mortalityRecords.reduce((s, h) => s + (h.mortalityCount || 0), 0);
        const diseaseRecords = recentHealth.filter(h => h.recordType === 'disease');
        const upcomingVaccines = recentHealth.filter(h => h.nextCheckDate && new Date(h.nextCheckDate) >= now);

        // Build context for AI
        const farmContext = `
Ferma statistikasi (hozirgi holat):
- Faol podalar soni: ${flocks.length}
- Jami faol tovuqlar: ${totalBirds} ta
- Podalar: ${flocks.map(f => `${f.name} (${f.breed}, ${f.quantity} ta, ${f.ageInDays} kunlik, ${f.housingUnit})`).join('; ')}

So'nggi 7 kunlik tuxum hisoboti:
- Jami yig'ilgan: ${totalEggs7d} ta
- Singan tuxumlar: ${totalBroken7d} ta
- Kunlik o'rtacha: ${recentEggs.length > 0 ? Math.round(totalEggs7d / Math.min(recentEggs.length, 7)) : 0} ta

So'nggi 7 kunlik yem hisoboti:
- Jami yem sarflangan: ${totalFeedKg7d} kg
- Jami yem xarajati: ${totalFeedCost7d.toLocaleString()} so'm

Sog'liq holati:
- So'nggi kasallik holatlari: ${diseaseRecords.length} ta
- So'nggi o'lim holatlari: ${totalMortality} ta
- Yaqinlashayotgan vaksinalar/tekshiruvlar: ${upcomingVaccines.length} ta
${upcomingVaccines.length > 0 ? upcomingVaccines.map(v => `  * ${v.flockId?.name}: ${v.description} - ${new Date(v.nextCheckDate).toLocaleDateString()}`).join('\n') : ''}

Bu oylik moliyaviy holat:
- Daromad: ${monthRevenue.toLocaleString()} so'm
- Xarajatlar: ${monthExpTotal.toLocaleString()} so'm
- Foyda/Zarar: ${profit >= 0 ? '+' : ''}${profit.toLocaleString()} so'm
- Xarajat tafsiloti: ${monthlyExpenses.map(e => `${e._id}: ${e.total.toLocaleString()} so'm`).join(', ')}
`;

        // Call Groq API
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.1-8b-instant',
                messages: [
                    {
                        role: 'system',
                        content: `Sen professional parrandachilik ferma maslahatchisisan. Ferma ma'lumotlarini tahlil qilib, O'ZBEK TILIDA amaliy maslahatlar ber. Javobingni quyidagi formatda ber:

📊 **HOLAT TAHLILI** - Fermaning hozirgi holatini qisqa baholaJavob har doim o'zbek tilida bo'lsin.

🎯 **MUHIM MASLAHATLAR** - 3-5 ta aniq amaliy maslahat

⚠️ **OGOHLANTIRISHLAR** - Muammolar yoki xavflar haqida

💡 **OPTIMALLASHTIRISH** - Foydani oshirish va xarajatni kamaytirish bo'yicha maslahatlar

Har bir maslahat aniq, qisqa va amaliy bo'lsin.`
                    },
                    {
                        role: 'user',
                        content: `Mana mening fermam haqida real ma'lumotlar. Tahlil qil va maslahat ber:\n\n${farmContext}`
                    }
                ],
                temperature: 0.7,
                max_tokens: 1500
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error('Groq API error:', errText);
            return res.status(500).json({ message: 'AI xizmatida xatolik', error: errText });
        }

        const data = await response.json();
        const advice = data.choices?.[0]?.message?.content || 'Maslahat olishda xatolik yuz berdi.';

        res.json({
            advice,
            farmSummary: {
                totalBirds,
                activeFlocks: flocks.length,
                eggs7d: totalEggs7d,
                broken7d: totalBroken7d,
                feedCost7d: totalFeedCost7d,
                monthRevenue,
                monthExpenses: monthExpTotal,
                profit,
                mortalityCount: totalMortality,
                upcomingChecks: upcomingVaccines.length
            },
            generatedAt: new Date().toISOString()
        });

    } catch (error) {
        console.error('AI Advice Error:', error);
        res.status(500).json({ message: 'AI maslahat olishda xatolik', error: error.message });
    }
};

module.exports = { getAIAdvice };
