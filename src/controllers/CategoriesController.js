const CategoriesService = require('../services/CategoriesService');

class CategoriesController {
  async createCategory(req, res, next) {
    try {
      const category = await CategoriesService.createCategory(req.body);
      return res.status(201).json({
        status: 'success',
        message: 'Category created successfully',
        data: { id: category.id, categoryId: category.id },
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllCategories(req, res, next) {
    try {
      const categories = await CategoriesService.getAllCategories();
      return res.status(200).json({
        status: 'success',
        data: { categories },
      });
    } catch (error) {
      next(error);
    }
  }

  async getCategoryById(req, res, next) {
    try {
      const category = await CategoriesService.getCategoryById(req.params.id);
      return res.status(200).json({
        status: 'success',
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateCategory(req, res, next) {
    try {
      const category = await CategoriesService.updateCategory(req.params.id, req.body);
      return res.status(200).json({
        status: 'success',
        message: 'Category updated successfully',
        data: { categoryId: category.id },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteCategory(req, res, next) {
    try {
      await CategoriesService.deleteCategory(req.params.id);
      return res.status(200).json({
        status: 'success',
        message: 'Category deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CategoriesController();
