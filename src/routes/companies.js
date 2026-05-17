const express = require('express');
const router = express.Router();
const CompaniesController = require('../controllers/CompaniesController');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const { createCompanySchema, updateCompanySchema } = require('../validators/companies');

router.get('/', CompaniesController.getAllCompanies);
router.get('/:id', CompaniesController.getCompanyById);

router.post('/', auth, validate(createCompanySchema), CompaniesController.createCompany);
router.put('/:id', auth, validate(updateCompanySchema), CompaniesController.updateCompany);
router.delete('/:id', auth, CompaniesController.deleteCompany);

module.exports = router;
