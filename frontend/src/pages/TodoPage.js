import React, { useState, useEffect } from "react";
import { TextField, Button, List, ListItem, ListItemText, IconButton } from "@mui/material";
import { Edit, Delete, Save } from "@mui/icons-material";
import axios from 'axios';

const ToDo = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedTask, setEditedTask] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          return alert('Please log in first!');
        }
    
        const response = await axios.get("http://localhost:5000/api/todo", {
          headers: { "Authorization": `Bearer ${token}` },
        });
    
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error.response?.data || error.message);
      }
    };
    
    
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (newTask.trim() === "") return;
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setErrorMessage("You need to log in first.");
        return;
      }
      const response = await axios.post(
        "http://localhost:5000/api/todo",   
        { task: newTask },
        { headers: { "Authorization": `Bearer ${token}` } }
      );
      setTasks([...tasks, response.data]);
      setNewTask("");
    } catch (error) {
      console.error("Error adding task:", error);
      setErrorMessage("Error adding task.");
    }
  };

  const deleteTask = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setErrorMessage("You need to log in first.");
        return;
      }
      await axios.delete(`http://localhost:5000/api/todo/${id}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
      setErrorMessage("Error deleting task.");
    }
  };

  const enableEditing = (index) => {
    setEditingIndex(index);
    setEditedTask(tasks[index].task);
  };

  const saveTask = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setErrorMessage("You need to log in first.");
        return;
      }
      const updatedTasks = [...tasks];
      updatedTasks[editingIndex].task = editedTask;
      setTasks(updatedTasks);
      setEditingIndex(null);
      setEditedTask("");

      await axios.put(
        `http://localhost:5000/api/todo/${id}`,   
        { task: editedTask },
        { headers: { "Authorization": `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Error saving task:", error);
      setErrorMessage("Error saving task.");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", textAlign: "center", padding: 20 }}>
      <h2>To-Do List</h2>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <TextField
        label="New Task"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={addTask} fullWidth>
        Add Task
      </Button>

      <List>
        {tasks.map((task, index) => (
          <ListItem key={task.id}>
            {editingIndex === index ? (
              <>
                <TextField
                  value={editedTask}
                  onChange={(e) => setEditedTask(e.target.value)}
                  fullWidth
                />
                <IconButton onClick={() => saveTask(task.id)} color="success">
                  <Save />
                </IconButton>
              </>
            ) : (
              <>
                <ListItemText primary={task.task} />
                <IconButton onClick={() => enableEditing(index)} color="primary">
                  <Edit />
                </IconButton>
                <IconButton onClick={() => deleteTask(task.id)} color="error">
                  <Delete />
                </IconButton>
              </>
            )}
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default ToDo;
