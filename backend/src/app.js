// app.js
const express = require('express');
const serverless = require('serverless-http')
const authRoutes = require('./routes/auth');
const articleRoutes = require('./routes/articles');
const userRoutes = require('./routes/users');
const companyRoutes = require('./routes/companies');
const db = require('./db');
const cors = require('cors');

require('dotenv').config();
const app = express();
app.use(express.json());
app.use(cors());
// GET all companies (Editor only)
app.get('/', (req, res) => {
  res.json("Connected Successfully")
});

app.use('/uploads', express.static('uploads')); // Serve static files from the 'uploads' directory

// Routes
app.use('/auth', authRoutes);
app.use('/articles', articleRoutes);
app.use('/users', userRoutes);
app.use('/companies', companyRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


module.exports.handler = serverless(app)