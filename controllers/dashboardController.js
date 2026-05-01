const Flock = require('../models/Flock');
const EggProduction = require('../models/EggProduction');
const SalesRecord = require('../models/SalesRecord');
const Expense = require('../models/Expense');

const getDashboardStats = async (req, res) => {
    try {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const last30Days = new Date(today.setDate(today.getDate() - 30));

        const totalBirds = await Flock.aggregate([
            { $match: { status: 'active' } },
            { $group: { _id: null, total: { $sum: '$quantity' } } }
        ]);

        const todayEggs = await EggProduction.aggregate([
            { $match: { date: { $gte: new Date(new Date().setHours(0,0,0,0)) } } },
            { $group: { _id: null, total: { $sum: '$eggsCollected' } } }
        ]);

        const monthlyRevenue = await SalesRecord.aggregate([
            { $match: { date: { $gte: startOfMonth } } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);

        const monthlyExpenses = await Expense.aggregate([
            { $match: { date: { $gte: startOfMonth } } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        // Charts data
        const eggProductionChart = await EggProduction.aggregate([
            { $match: { date: { $gte: last30Days } } },
            { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }, total: { $sum: "$eggsCollected" } } },
            { $sort: { _id: 1 } }
        ]);

        const expensesByCategory = await Expense.aggregate([
            { $group: { _id: "$category", total: { $sum: "$amount" } } }
        ]);

        res.json({
            summary: {
                totalBirds: totalBirds[0]?.total || 0,
                todayEggs: todayEggs[0]?.total || 0,
                monthlyRevenue: monthlyRevenue[0]?.total || 0,
                monthlyExpenses: monthlyExpenses[0]?.total || 0,
                profit: (monthlyRevenue[0]?.total || 0) - (monthlyExpenses[0]?.total || 0)
            },
            charts: {
                eggProduction: eggProductionChart,
                expensesByCategory: expensesByCategory
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getDashboardStats };
