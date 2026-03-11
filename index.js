const express = require('express');
const mongoose = require('mongoose');
const apiRoutes = require('./routes/api');

const app = express();
app.use(express.json()); // Hỗ trợ đọc dữ liệu body rạng JSON

// Đăng ký toàn bộ router API vào ứng dụng với tiền tố /api
app.use('/api', apiRoutes);

// Kết nối cơ sở dữ liệu MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/nnptud')
    .then(() => {
        console.log('Connected to MongoDB Database');
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    })
    .catch(err => console.error('Could not connect to MongoDB:', err));
