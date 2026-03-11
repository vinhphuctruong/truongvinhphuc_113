const mongoose = require('mongoose');
const Role = require('./models/Role');

const roles = [
    { name: 'Admin', description: 'Quản trị viên hệ thống' },
    { name: 'User', description: 'Người dùng thông thường' }
];

async function seedDB() {
    try {
        console.log('Đang kết nối tới MongoDB...');
        await mongoose.connect('mongodb://127.0.0.1:27017/nnptud');

        console.log('Đang khởi tạo dữ liệu mẫu cho Roles...');

        for (const roleData of roles) {
            const existing = await Role.findOne({ name: roleData.name });
            if (!existing) {
                await Role.create(roleData);
                console.log(`- Đã tạo Role: ${roleData.name}`);
            } else {
                console.log(`- Role "${roleData.name}" đã tồn tại.`);
            }
        }

        console.log('Khởi tạo database thành công!');
        process.exit(0);
    } catch (err) {
        console.error('Lỗi khi khởi tạo database:', err);
        console.log('\nLƯU Ý: Hãy đảm bảo bạn đã cài đặt MongoDB và dịch vụ MongoDB đang chạy tại localhost:27017');
        process.exit(1);
    }
}

seedDB();
