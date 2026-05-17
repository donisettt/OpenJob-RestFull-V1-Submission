const express = require('express');
const router = express.Router();
const JobsController = require('../controllers/JobsController');
const BookmarksController = require('../controllers/BookmarksController');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const { createJobSchema, updateJobSchema, jobQuerySchema } = require('../validators/jobs');

router.get('/', validate(jobQuerySchema, 'query'), JobsController.getAllJobs);
router.get('/company/:companyId', JobsController.getJobsByCompany);
router.get('/category/:categoryId', JobsController.getJobsByCategory);
router.get('/:id', JobsController.getJobById);
router.post('/', auth, validate(createJobSchema), JobsController.createJob);
router.put('/:id', auth, validate(updateJobSchema), JobsController.updateJob);
router.delete('/:id', auth, JobsController.deleteJob);

router.post('/:jobId/bookmark', auth, BookmarksController.createBookmark);
router.get('/:jobId/bookmark/:id', auth, BookmarksController.getBookmarkById);
router.delete('/:jobId/bookmark', auth, BookmarksController.deleteBookmark);

module.exports = router;
