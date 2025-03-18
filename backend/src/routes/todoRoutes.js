const express = require('express');
const { getTodos, addTodo, deleteTodo, updateTodo } = require('../controllers/todoController');
const authenticateToken = require('../middleware/authMidllware');

const router = express.Router();

router.get('/todo', authenticateToken, getTodos);
router.post('/todo', authenticateToken, addTodo);
router.delete('/todo/:id', authenticateToken, deleteTodo);
router.put('/todo/:id', authenticateToken, updateTodo); 

module.exports = router;
