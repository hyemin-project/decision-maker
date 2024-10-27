const express = require('express');
const cors = require('cors');
require('dotenv').config(); // .env file load

// print env
// console.log('DB_NAME:', process.env.DB_NAME);
// console.log('DB_USERNAME:', process.env.DB_USERNAME);
// console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
// console.log('DB_HOST:', process.env.DB_HOST);
// console.log('DB_PORT:', process.env.DB_PORT);
// console.log('DB_DIALECT:', process.env.DB_DIALECT);

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:8080' // frontend
}));
app.use(express.json());

// Database
const db = require('./models');

// Test database connection
db.sequelize.authenticate()
  .then(() => console.log('Database connected.'))
  .catch(err => console.error('Unable to connect to the database:', err));

// Routes
const userRoutes = require('./routes/userRoutes');
const saveResults = require('./routes/saveResults');
const authRoutes = require('./routes/authRoutes');
const decisionsRouter = require('./routes/decisions');

app.use('/api/decisions', decisionsRouter);
app.use('/api/users', userRoutes);
app.use('/api/results', saveResults);
app.use('/api/auth', authRoutes);

db.sequelize.sync({ force: false }).then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});
