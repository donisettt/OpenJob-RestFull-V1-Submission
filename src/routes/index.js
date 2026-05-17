const usersRouter = require('./users');
const authenticationsRouter = require('./authentications');
const companiesRouter = require('./companies');
const categoriesRouter = require('./categories');
const jobsRouter = require('./jobs');
const applicationsRouter = require('./applications');
const bookmarksRouter = require('./bookmarks');
const documentsRouter = require('./documents');
const profileRouter = require('./profile');

const registerRoutes = (app) => {
  app.use('/users', usersRouter);
  app.use('/authentications', authenticationsRouter);
  app.use('/companies', companiesRouter);
  app.use('/categories', categoriesRouter);
  app.use('/jobs', jobsRouter);
  app.use('/applications', applicationsRouter);
  app.use('/bookmarks', bookmarksRouter);
  app.use('/documents', documentsRouter);
  app.use('/profile', profileRouter);
};

module.exports = registerRoutes;
