const express = require('express');
const authRouter = express.Router();
const authController = require('../controllers/authController');
const { csrfMiddleware } = require('../middleware/CSRFMiddleware');

authRouter.post('/register', csrfMiddleware, authController.register);
authRouter.post('/login', csrfMiddleware, authController.login);

module.exports = authRouter;