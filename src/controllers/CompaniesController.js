const CompaniesService = require('../services/CompaniesService');

class CompaniesController {
  async createCompany(req, res, next) {
    try {
      const { name, description, industry, location, website } = req.body;
      const logo_url = req.body.logo_url || req.body.logoUrl;
      const userId = req.user.id;
      const company = await CompaniesService.createCompany({ name, description, industry, location, website, logo_url, userId });
      return res.status(201).json({
        status: 'success',
        message: 'Company created successfully',
        data: { id: company.id, companyId: company.id },
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllCompanies(req, res, next) {
    try {
      const companies = await CompaniesService.getAllCompanies();
      return res.status(200).json({
        status: 'success',
        data: { companies },
      });
    } catch (error) {
      next(error);
    }
  }

  async getCompanyById(req, res, next) {
    try {
      const company = await CompaniesService.getCompanyById(req.params.id);
      return res.status(200).json({
        status: 'success',
        data: company,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateCompany(req, res, next) {
    try {
      const payload = { ...req.body };
      if (Object.prototype.hasOwnProperty.call(payload, 'logoUrl')) {
        payload.logo_url = payload.logoUrl;
        delete payload.logoUrl;
      }

      const company = await CompaniesService.updateCompany(req.params.id, payload);
      return res.status(200).json({
        status: 'success',
        message: 'Company updated successfully',
        data: { companyId: company.id },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteCompany(req, res, next) {
    try {
      await CompaniesService.deleteCompany(req.params.id);
      return res.status(200).json({
        status: 'success',
        message: 'Company deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CompaniesController();
