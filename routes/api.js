const express = require('express');
const router = express.Router();
const roleController = require('../controllers/RoleController');
const userController = require('../controllers/UserController');

// ---- Yêu cầu 1: Khai báo CRUD routes cho Role ----
router.post('/roles', roleController.createRole);
router.get('/roles', roleController.getAllRoles);
router.get('/roles/:id', roleController.getRoleById);
router.put('/roles/:id', roleController.updateRole);
router.delete('/roles/:id', roleController.deleteRole);

// ---- Yêu cầu 1: Khai báo CRUD routes cho User ----
router.post('/users', userController.createUser);
router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

// ---- Yêu cầu 2: API POST /enable ----
router.post('/enable', userController.enableUser);

// ---- Yêu cầu 3: API POST /disable ----
router.post('/disable', userController.disableUser);

// ---- Yêu cầu 4: Lấy danh sách user theo tham số role id ----
router.get('/roles/:id/users', userController.getUsersByRoleId);

module.exports = router;
