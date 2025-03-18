const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRouter = require('./src/routes/authRoutes');
const todoRouter = require('./src/routes/todoRoutes');

const app = express();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

app.use('/auth', authRouter);
app.use('/api', todoRouter);

app.listen(process.env.PORT || 5000, () => {
  console.log(` Server running on port ${process.env.PORT || 5000}`);
});
