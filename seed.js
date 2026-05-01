require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Flock = require('./models/Flock');
const EggProduction = require('./models/EggProduction');
const FeedRecord = require('./models/FeedRecord');
const HealthRecord = require('./models/HealthRecord');
const SalesRecord = require('./models/SalesRecord');
const Expense = require('./models/Expense');

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected for seeding...');

        // Clear existing data
        await User.deleteMany();
        await Flock.deleteMany();
        await EggProduction.deleteMany();
        await FeedRecord.deleteMany();
        await HealthRecord.deleteMany();
        await SalesRecord.deleteMany();
        await Expense.deleteMany();

        // Create Admin User
        const admin = await User.create({
            name: 'Admin',
            email: 'admin@farm.uz',
            password: 'admin123',
            role: 'admin'
        });

        // Create Flocks
        const flock1 = await Flock.create({
            flockId: 'P001',
            name: 'Oq Tovuqlar',
            breed: 'Broiler',
            quantity: 1000,
            ageInDays: 45,
            arrivalDate: new Date('2026-03-15'),
            status: 'active',
            housingUnit: 'Barn 1'
        });

        const flock2 = await Flock.create({
            flockId: 'P002',
            name: 'Qizil Tovuqlar',
            breed: 'Layer',
            quantity: 800,
            ageInDays: 120,
            arrivalDate: new Date('2026-01-10'),
            status: 'active',
            housingUnit: 'Barn 2'
        });

        const flocks = [flock1, flock2];

        // Seed Egg Production (last 30 days)
        for (let i = 0; i < 30; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            await EggProduction.create({
                flockId: flock2._id,
                date,
                eggsCollected: Math.floor(Math.random() * (750 - 700 + 1) + 700),
                brokenEggs: Math.floor(Math.random() * 10),
                soldEggs: 600,
                remainingEggs: 100,
                pricePerEgg: 1200,
                totalRevenue: 600 * 1200
            });
        }

        // Seed Feed Records
        for (let i = 0; i < 15; i++) {
            const date = new Date();
            date.setDate(date.getDate() - (i * 2));
            await FeedRecord.create({
                flockId: flocks[i % 2]._id,
                date,
                feedType: 'grower',
                quantityKg: 200,
                costPerKg: 4500,
                totalCost: 200 * 4500,
                supplier: 'Yem-Sifat Cluster'
            });
        }

        // Seed Health Records
        for (let i = 0; i < 10; i++) {
            await HealthRecord.create({
                flockId: flocks[i % 2]._id,
                date: new Date(),
                recordType: i % 3 === 0 ? 'vaccination' : 'treatment',
                description: i % 3 === 0 ? 'Vaksina qabul qilindi' : 'Umumiy nazorat',
                medicineUsed: i % 3 === 0 ? 'Newcastle Vaccine' : 'Enrofloxacin',
                dosage: '0.5ml',
                mortalityCount: i % 5 === 0 ? 2 : 0,
                veterinarianName: 'Dr. Ahmadov',
                cost: 50000
            });
        }

        // Seed Sales Records
        for (let i = 0; i < 20; i++) {
            await SalesRecord.create({
                flockId: flocks[i % 2]._id,
                date: new Date(),
                saleType: 'eggs',
                quantity: 500,
                unit: 'pieces',
                pricePerUnit: 1200,
                totalAmount: 500 * 1200,
                buyerName: 'Savdo Markazi #' + (i + 1),
                paymentStatus: i % 4 === 0 ? 'pending' : 'paid'
            });
        }

        // Seed Expenses
        const categories = ['feed', 'medicine', 'equipment', 'labor', 'utilities', 'other'];
        for (let i = 0; i < 15; i++) {
            await Expense.create({
                date: new Date(),
                category: categories[i % categories.length],
                description: 'Oylik xarajat #' + (i + 1),
                amount: Math.floor(Math.random() * (500000 - 100000 + 1) + 100000),
                paymentMethod: 'cash'
            });
        }

        console.log('Seeding complete!');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedData();
