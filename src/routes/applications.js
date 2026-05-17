const express = require('express');
const router = express.Router();
const ApplicationsController = require('../controllers/ApplicationsController');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const { createApplicationSchema, updateApplicationSchema } = require('../validators/applications');

router.get('/user/:userId', auth, ApplicationsController.getApplicationsByUser);
router.get('/job/:jobId', auth, ApplicationsController.getApplicationsByJob);

router.post('/', auth, validate(createApplicationSchema), ApplicationsController.createApplication);
router.get('/', auth, ApplicationsController.getAllApplications);
router.get('/:id', auth, ApplicationsController.getApplicationById);
router.put('/:id', auth, validate(updateApplicationSchema), ApplicationsController.updateApplicationStatus);
router.delete('/:id', auth, ApplicationsController.deleteApplication);

module.exports = router;
