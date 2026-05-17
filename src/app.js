require('dotenv').config();
const express = require('express');
const registerRoutes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const createApp = () => {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/uploads', express.static('uploads'));

  app.get('/', (_req, res) => {
    res.status(200).json({
      status: 'success',
      message: 'OpenJob RESTful API v1 is running',
    });
  });

  registerRoutes(app);

  app.use((_req, res) => {
    res.status(404).json({
      status: 'failed',
      message: 'Route not found',
    });
  });

  app.use(errorHandler);

  return app;
};

module.exports = createApp;
