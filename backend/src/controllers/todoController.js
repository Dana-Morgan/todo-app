const pool = require('../models/db');

// CSRF Token Handling
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

const express = require('express');
const app = express();
app.use(express.json());
app.use(csrfProtection);

// Get CSRF Token
app.get('/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Get all todos for a user
exports.getTodos = async (req, res) => {
  try {
    const todos = await pool.query("SELECT * FROM todos WHERE user_id = $1", [req.user.userId]);
    res.json(todos.rows);
  } catch (error) {
    console.error("Get Todos Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Add a new todo for a user
exports.addTodo = async (req, res) => {
  try {
    const { task } = req.body;
    if (!task) {
      return res.status(400).json({ error: "Task is required" });
    }
    const result = await pool.query(
      "INSERT INTO todos (task, user_id, completed) VALUES ($1, $2, $3) RETURNING *",
      [task, req.user.userId, false]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Add Todo Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Delete a todo by its ID
exports.deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Task ID is required" });
    }
    const checkTodo = await pool.query("SELECT * FROM todos WHERE id = $1 AND user_id = $2", [id, req.user.userId]);
    if (checkTodo.rows.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }
    await pool.query("DELETE FROM todos WHERE id = $1 AND user_id = $2", [id, req.user.userId]);
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Update a todo's task and completion status
exports.updateTodo = async (req, res) => {
  try {
    const { task, completed } = req.body;
    const { id } = req.params;
    if (!task || !id) {
      return res.status(400).json({ error: "Task and ID are required" });
    }
    const checkTodo = await pool.query("SELECT * FROM todos WHERE id = $1 AND user_id = $2", [id, req.user.userId]);
    if (checkTodo.rows.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }
    const result = await pool.query(
      "UPDATE todos SET task = $1, completed = $2 WHERE id = $3 AND user_id = $4 RETURNING *",
      [task, completed, id, req.user.userId]
    );
    res.json({ message: "Task updated successfully", task: result.rows[0] });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Toggle completion status of a todo
exports.toggleCompletion = async (req, res) => {
  try {
    const { id } = req.params;
    const checkTodo = await pool.query("SELECT * FROM todos WHERE id = $1 AND user_id = $2", [id, req.user.userId]);
    if (checkTodo.rows.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }
    const currentStatus = checkTodo.rows[0].completed;
    const result = await pool.query(
      "UPDATE todos SET completed = $1 WHERE id = $2 AND user_id = $3 RETURNING *",
      [!currentStatus, id, req.user.userId]
    );
    res.json({ message: "Task completion status updated", task: result.rows[0] });
  } catch (error) {
    console.error("Toggle Completion Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
