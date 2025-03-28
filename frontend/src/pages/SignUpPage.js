import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { Grid, Paper, Typography, Button, IconButton } from '@mui/material';
import { Autorenew } from '@mui/icons-material';
import AuthFormInputs from '../components/AuthFormInputs';
import { validationSchema } from '../validation/valid';
import axios from 'axios';

const SignUpForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get('http://localhost:5000/csrf-token', { withCredentials: true });
        setCsrfToken(response.data.csrfToken);
      } catch (error) {
        console.error("Error fetching CSRF token:", error);
      }
    };
    fetchCsrfToken();
  }, []);

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
        const response = await axios.post(
          'http://localhost:5000/auth/register',
          values,
          {
            headers: { "X-CSRF-Token": csrfToken },
            withCredentials: true, 
          }
        );

        localStorage.setItem('csrfToken', response.data.csrfToken);
        navigate('/todo');
      } catch (error) {
        console.error('Error during registration:', error.response ? error.response.data : error.message);
      }
    },
  });

  return (
    <Grid container justifyContent="center" alignItems="center" height="100vh">
      <Grid item>
        <Paper elevation={3} style={{ padding: 20, maxWidth: 400, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>Sign Up</Typography>
          <form onSubmit={formik.handleSubmit}>
            <AuthFormInputs 
              formik={formik}
              showPassword={showPassword}
              handleTogglePassword={() => setShowPassword(!showPassword)}
              isSignUp={true}
            />
            <IconButton onClick={() => formik.setFieldValue("password", Math.random().toString(36).slice(-8))}>
              <Autorenew />
            </IconButton>
            <Button variant="contained" color="primary" type="submit" fullWidth>Sign Up</Button>
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
