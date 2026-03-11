const User = require('../models/User');

// Yêu cầu 1: C R U D cho User (Với Soft Delete)
exports.createUser = async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ isDeleted: false }).populate('role');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id, isDeleted: false }).populate('role');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            req.body,
            { new: true }
        );
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteUser = async (req, res) => { // Soft delete
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            { isDeleted: true }, // Đánh dấu xoá mềm
            { new: true }
        );
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User soft deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Yêu cầu 2: Hàm POST /enable truyền lên email và username -> bật status=true
exports.enableUser = async (req, res) => {
    try {
        const { email, username } = req.body;
        const user = await User.findOneAndUpdate(
            { email, username, isDeleted: false },
            { status: true },
            { new: true }
        ).populate('role');

        if (!user) return res.status(404).json({ message: 'User not found or credentials incorrect' });
        res.status(200).json({ message: 'User enabled successfully', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Yêu cầu 3: Hàm POST /disable truyền lên email và username -> bật status=false
exports.disableUser = async (req, res) => {
    try {
        const { email, username } = req.body;
        const user = await User.findOneAndUpdate(
            { email, username, isDeleted: false },
            { status: false },
            { new: true }
        ).populate('role');

        if (!user) return res.status(404).json({ message: 'User not found or credentials incorrect' });
        res.status(200).json({ message: 'User disabled successfully', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Yêu cầu 4: Hàm GET lấy tất cả user theo role ID (GET /roles/:id/users)
exports.getUsersByRoleId = async (req, res) => {
    try {
        const { id: roleId } = req.params;
        const users = await User.find({ role: roleId, isDeleted: false }).populate('role');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
