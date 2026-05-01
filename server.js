require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const flockRoutes = require('./routes/flockRoutes');
const eggRoutes = require('./routes/eggRoutes');
const feedRoutes = require('./routes/feedRoutes');
const healthRoutes = require('./routes/healthRoutes');
const salesRoutes = require('./routes/salesRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const aiRoutes = require('./routes/aiRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/flocks', flockRoutes);
app.use('/api/eggs', eggRoutes);
app.use('/api/feed', feedRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/ai', aiRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB Connected');
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => console.log(err));
