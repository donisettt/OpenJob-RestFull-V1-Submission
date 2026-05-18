const CompaniesService = require('../services/CompaniesService');
const CacheService = require('../services/CacheService');

class CompaniesController {
  async createCompany(req, res, next) {
    try {
      const { name, description, industry, location, website } = req.body;
      const logo_url = req.body.logo_url || req.body.logoUrl;
      const userId = req.user.id;
      const company = await CompaniesService.createCompany({ name, description, industry, location, website, logo_url, userId });
      await CacheService.delete(CacheService.keys.company(company.id));
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
      const cacheKey = CacheService.keys.company(req.params.id);
      const cachedCompany = await CacheService.get(cacheKey);
      if (cachedCompany) {
        return res
          .set('X-Data-Source', 'cache')
          .status(200)
          .json({
            status: 'success',
            data: cachedCompany,
          });
      }

      const company = await CompaniesService.getCompanyById(req.params.id);
      await CacheService.set(cacheKey, company);
      return res
        .set('X-Data-Source', 'database')
        .status(200)
        .json({
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
      await CacheService.delete(CacheService.keys.company(req.params.id));
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
      await CacheService.delete(CacheService.keys.company(req.params.id));
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
