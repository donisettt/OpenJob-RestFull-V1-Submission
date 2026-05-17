const express = require('express');
const router = express.Router();
const CategoriesController = require('../controllers/CategoriesController');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const { createCategorySchema, updateCategorySchema } = require('../validators/categories');

router.get('/', CategoriesController.getAllCategories);
router.get('/:id', CategoriesController.getCategoryById);

router.post('/', auth, validate(createCategorySchema), CategoriesController.createCategory);
router.put('/:id', auth, validate(updateCategorySchema), CategoriesController.updateCategory);
router.delete('/:id', auth, CategoriesController.deleteCategory);

module.exports = router;
