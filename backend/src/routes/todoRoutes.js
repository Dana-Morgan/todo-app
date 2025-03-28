const express = require('express');
const { getTodos, addTodo, deleteTodo, updateTodo, toggleCompletion } = require('../controllers/todoController');
const authenticateToken = require('../middleware/authMidllware');

const router = express.Router();

router.get('/todo', authenticateToken, getTodos);  
router.post('/todo', authenticateToken, addTodo);  
router.delete('/todo/:id', authenticateToken, deleteTodo); 
router.put('/todo/:id', authenticateToken, updateTodo);
router.put('/todo/:id/completion', authenticateToken, toggleCompletion);  

module.exports = router;
