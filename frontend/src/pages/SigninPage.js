import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { Grid, Paper, Typography, Button } from '@mui/material';
import AuthFormInputs from '../components/AuthFormInputs'; 
import { validationSchema } from '../validation/valid';
import api from '../api/axiosConfig'; 

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await api.post('/auth/login', values);

        localStorage.setItem('token', response.data.token);
        localStorage.setItem('csrfToken', response.data.csrfToken); 
        navigate('/todo');
      } catch (error) {
        console.error('Error during login:', error.response ? error.response.data : error.message);
      }
    },
  });

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const fetchCsrfToken = async () => {
    try {
      const response = await api.get('/csrf-token'); 
      setCsrfToken(response.data.csrfToken); 
    } catch (error) {
      console.error("Error fetching CSRF token:", error);
    }
  };

  useEffect(() => {
    fetchCsrfToken(); 
  }, []);

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
