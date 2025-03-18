import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { Grid, Paper, Typography, Button, IconButton } from '@mui/material';
import { Autorenew } from '@mui/icons-material';
import AuthFormInputs from '../components/AuthFormInputs';
import { validationSchema } from '../validation/valid';
import axios from 'axios'; 

const SignUpForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      gender: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        console.log('User input:', values); 
        const response = await axios.post('http://localhost:5000/auth/register', values);
        console.log('Server Response:', response.data);
        navigate('/todo'); 
      } catch (error) {
        console.error('Error during registration:', error.response ? error.response.data : error.message);
      }
    },
  });

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const generatePassword = () => {
    const randomPassword = Math.random().toString(36).slice(-8);
    formik.setFieldValue("password", randomPassword);
  };

  return (
    <Grid container justifyContent="center" alignItems="center" height="100vh">
      <Grid item>
        <Paper elevation={3} style={{ padding: 20, maxWidth: 400, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Sign Up
          </Typography>
          <form onSubmit={formik.handleSubmit}>
            <AuthFormInputs 
              formik={formik}
              showPassword={showPassword}
              handleTogglePassword={handleTogglePassword}
              isSignUp={true} 
            />
            <IconButton onClick={generatePassword} edge="end">
              <Autorenew />
            </IconButton>
            <Button variant="contained" color="primary" type="submit" fullWidth>
              Sign Up
            </Button>
          </form>
          <Typography variant="body2" style={{ marginTop: 10 }}>
            Already have an account? <Link to="/">Login</Link>
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default SignUpForm;
