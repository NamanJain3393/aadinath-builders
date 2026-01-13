const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

connectDB();

app.get('/health', (req, res) => {
    res.json({ status: "Aadinath Builders API running" });
});

app.use('/api/auth', require('./routes/userRoutes'));
app.use('/api/properties', require('./routes/propertyRoutes'));
app.use('/api/inquiries', require('./routes/inquiryRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/visits', require('./routes/visitRoutes'));

app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.get('/', (req, res) => {
    res.send('Aadinath Builders API is running...');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});