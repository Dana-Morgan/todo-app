const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const csrf = require('csurf');
require('dotenv').config();
const { authenticateToken } = require('./src/middleware/authMidllware');
const { verifyCsrfToken } = require('./src/middleware/CSRFMiddleware');
const todoRouter = require('./src/routes/todoRoutes');
const authRouter = require('./src/routes/authRoutes');

const app = express();

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true, 
  })
);

app.use(cookieParser());
app.use(express.json());

const csrfProtection = csrf({ cookie: { httpOnly: true, secure: false, sameSite: 'strict' } });
app.use(csrfProtection);

app.get('/csrf-token', (req, res) => {
  res.cookie('XSRF-TOKEN', req.csrfToken(), {
    httpOnly: false, 
    secure: false, 
    sameSite: 'strict',
  });
  res.json({ csrfToken: req.csrfToken() });
});

app.use('/api', verifyCsrfToken, todoRouter);
app.use('/auth', authRouter);

app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).json({ message: 'Invalid CSRF token' });
  }
  next(err);
});

app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});
