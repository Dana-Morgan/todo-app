import React, { useState, useEffect } from "react";
import { TextField, Button, List, ListItem, ListItemText, IconButton, Checkbox, Snackbar } from "@mui/material";
import { Edit, Delete, Save, ExitToApp } from "@mui/icons-material";
import api from '../api/axiosConfig'; 
import { useNavigate } from 'react-router-dom';

const ToDo = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState(''); 
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedTask, setEditedTask] = useState(''); 
  const [errorMessage, setErrorMessage] = useState('');
  const [csrfToken, setCsrfToken] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false); 
  const navigate = useNavigate();

  const fetchCsrfToken = async () => {
    try {
      const response = await api.get('/csrf-token');
      setCsrfToken(response.data.csrfToken);
      localStorage.setItem('csrfToken', response.data.csrfToken);
      fetchTasks(); 
    } catch (error) {
      console.error("Error fetching CSRF token:", error);
      setErrorMessage("Failed to fetch CSRF token.");
      setOpenSnackbar(true); 
    }
  };

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const csrfToken = localStorage.getItem('csrfToken');

      if (!token || !csrfToken) {
        return navigate('/');
      }

      const response = await api.get("/api/todo", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "X-CSRF-Token": csrfToken,
        },
      });

      setTasks(response.data); 
    } catch (error) {
      console.error("Error fetching tasks:", error.response?.data || error.message);
      setErrorMessage("Failed to fetch tasks. Please try again later.");
      setOpenSnackbar(true); 
    }
  };

  useEffect(() => {
    fetchCsrfToken();
  }, []);

  const addTask = async () => {
    if (newTask.trim() === '') return;
    try {
      const token = localStorage.getItem('token');
      const csrfToken = localStorage.getItem('csrfToken');

      if (!token || !csrfToken) {
        setErrorMessage("You need to log in first.");
        setOpenSnackbar(true); 
        return;
      }

      const response = await api.post("/api/todo", { task: newTask }, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "X-CSRF-Token": csrfToken,
        }
      });

      setTasks(prevTasks => [...prevTasks, response.data]);
      setNewTask(''); 
    } catch (error) {
      console.error("Error adding task:", error);
      setErrorMessage("Error adding task. Please try again.");
      setOpenSnackbar(true); 
    }
  };

  const deleteTask = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const csrfToken = localStorage.getItem('csrfToken');

      if (!token || !csrfToken) {
        setErrorMessage("You need to log in first.");
        setOpenSnackbar(true); 
        return;
      }

      const response = await api.delete(`/api/todo/${id}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "X-CSRF-Token": csrfToken,
        }
      });

      if (response.status === 200) {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      setErrorMessage("Error deleting task. Please try again.");
      setOpenSnackbar(true); 
    }
  };

  const enableEditing = (index) => {
    setEditingIndex(index);
    setEditedTask(tasks[index].task || ''); 
  };

  const saveTask = async (id) => {
    if (editedTask.trim() === '') return;
    try {
      const token = localStorage.getItem('token');
      const csrfToken = localStorage.getItem('csrfToken');

      if (!token || !csrfToken) {
        setErrorMessage("You need to log in first.");
        setOpenSnackbar(true);
        return;
      }

      const updatedTasks = [...tasks];
      updatedTasks[editingIndex].task = editedTask;
      setTasks(updatedTasks); 
      setEditingIndex(null);
      setEditedTask(''); 

      await api.put(`/api/todo/${id}`, { task: editedTask }, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "X-CSRF-Token": csrfToken,
        }
      });
    } catch (error) {
      console.error("Error saving task:", error);
      setErrorMessage("Error saving task. Please try again.");
      setOpenSnackbar(true);
    }
  };

  const toggleCompletion = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const csrfToken = localStorage.getItem('csrfToken');

      if (!token || !csrfToken) {
        setErrorMessage("You need to log in first.");
        setOpenSnackbar(true); 
        return;
      }

      await api.put(`/api/todo/${id}/completion`, {}, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "X-CSRF-Token": csrfToken,
        }
      });

      setTasks(prevTasks => prevTasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      ));
    } catch (error) {
      console.error("Error toggling completion:", error);
      setErrorMessage("Error toggling task completion. Please try again.");
      setOpenSnackbar(true); 
    }
  };

  const logOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('csrfToken');
    navigate('/');
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", textAlign: "center", padding: 20 }}>
      <h2>To-Do List</h2>
      <Button variant="contained" color="secondary" onClick={logOut} fullWidth>
        <ExitToApp /> Log Out
      </Button>

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
                <Checkbox
                  checked={task.completed}
                  onChange={() => toggleCompletion(task.id)}
                  color="primary"
                />
                <ListItemText
                  primary={task.task}
                  style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
                />
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

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={errorMessage}
      />
    </div>
  );
};

export default ToDo;
