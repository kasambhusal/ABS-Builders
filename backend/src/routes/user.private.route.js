const express = require('express');
const { getUsers, updateUser, updatePassword, deleteUser, createUser } = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');
const superadminMiddleware = require('../middleware/superadmin.middleware');
const selfUserMiddleware = require('../middleware/self-user.middleware');
const authController = require('../controllers/auth.controller');

const apiRouter = express.Router();
apiRouter.use(authMiddleware);

// Only superadmin can manage users
apiRouter.get('/', superadminMiddleware, getUsers);
apiRouter.post('/', superadminMiddleware, createUser);
apiRouter.delete('/:id', superadminMiddleware, deleteUser);

apiRouter.post('/login', authController.login); // Dashboard auth can go here

// Modifying profile
apiRouter.put('/:id', selfUserMiddleware, updateUser);
apiRouter.put('/password/:id', selfUserMiddleware, updatePassword);

module.exports = apiRouter;
