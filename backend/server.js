// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Import Routes
const vehiclesRoutes = require('./routes/vehicles.routes.js');
const customersRoutes = require('./routes/customers.routes.js');
const rentalsRoutes = require('./routes/rentals.routes.js');
const paymentsRoutes = require('./routes/payments.routes.js');
const dashboardRoutes = require('./routes/dashboard.route.js');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// API Routes
app.use('/api/vehicles', vehiclesRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/rentals', rentalsRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/', (req, res) => res.send('Rental API Running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
