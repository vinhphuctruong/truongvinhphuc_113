const Role = require('../models/Role');

// Yêu cầu 1: C R U D cho Role (Với Soft Delete)
exports.createRole = async (req, res) => {
    try {
        const role = new Role(req.body);
        await role.save();
        res.status(201).json(role);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAllRoles = async (req, res) => {
    try {
        const roles = await Role.find({ isDeleted: false });
        res.status(200).json(roles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getRoleById = async (req, res) => {
    try {
        const role = await Role.findOne({ _id: req.params.id, isDeleted: false });
        if (!role) return res.status(404).json({ message: 'Role not found' });
        res.status(200).json(role);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateRole = async (req, res) => {
    try {
        const role = await Role.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            req.body,
            { new: true }
        );
        if (!role) return res.status(404).json({ message: 'Role not found' });
        res.status(200).json(role);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteRole = async (req, res) => { // Soft delete
    try {
        const role = await Role.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            { isDeleted: true }, // Cập nhật trạng thái xoá mềm thành true
            { new: true }
        );
        if (!role) return res.status(404).json({ message: 'Role not found' });
        res.status(200).json({ message: 'Role soft deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
