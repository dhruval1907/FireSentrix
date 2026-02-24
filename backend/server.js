const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/clients', require('./routes/clientRoutes'));
app.use('/api/v1/sites', require('./routes/siteRoutes'));
app.use('/api/v1/guards', require('./routes/guardRoutes'));
app.use('/api/v1/equipment', require('./routes/equipmentRoutes'));
app.use('/api/v1/attendance', require('./routes/attendanceRoutes'));
app.use('/api/v1/salaries', require('./routes/salaryRoutes'));
app.use('/api/v1/invoices', require('./routes/invoiceRoutes'));
app.use('/api/v1/messages', require('./routes/messageRoutes'));

// Health check
app.get('/api/v1/health', (req, res) => {
    res.json({ success: true, message: 'Krusha Fire API is running' });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
