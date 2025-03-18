import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { Grid, Paper, Typography, Button } from '@mui/material';
import AuthFormInputs from '../components/AuthFormInputs'; 
import { validationSchema } from '../validation/valid';
import axios from 'axios';

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        console.log('User submitted values:', values);
        
        const response = await axios.post('http://localhost:5000/auth/login', values); 
        console.log('Server Response:', response.data);
        localStorage.setItem('token', response.data.token); 
        navigate('/todo'); 
      } catch (error) {
        console.error('Error during login:', error.response ? error.response.data : error.message);
      }
    },
  });

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Grid container justifyContent="center" alignItems="center" height="100vh">
      <Grid item>
        <Paper elevation={3} style={{ padding: 20, maxWidth: 400, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Login
          </Typography>
          <form onSubmit={formik.handleSubmit}>
            <AuthFormInputs 
              formik={formik}
              showPassword={showPassword}
              handleTogglePassword={handleTogglePassword}
              isSignUp={false} 
            />
            <Button variant="contained" color="primary" type="submit" fullWidth>
              Login
            </Button>
          </form>
          <Typography variant="body2" style={{ marginTop: 10 }}>
            No Account? <Link to="/signup">Sign up</Link>
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default LoginForm;
