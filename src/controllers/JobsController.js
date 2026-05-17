const JobsService = require('../services/JobsService');

const pickAlias = (source, snakeName, camelName) => {
  if (Object.prototype.hasOwnProperty.call(source, snakeName)) {
    return source[snakeName];
  }
  return source[camelName];
};

class JobsController {
  async createJob(req, res, next) {
    try {
      const payload = {
        ...req.body,
        company_id: pickAlias(req.body, 'company_id', 'companyId'),
        category_id: pickAlias(req.body, 'category_id', 'categoryId'),
        salary_min: pickAlias(req.body, 'salary_min', 'salaryMin'),
        salary_max: pickAlias(req.body, 'salary_max', 'salaryMax'),
        location_type: pickAlias(req.body, 'location_type', 'locationType'),
        job_type: pickAlias(req.body, 'job_type', 'jobType'),
        experience_level: pickAlias(req.body, 'experience_level', 'experienceLevel'),
      };
      const job = await JobsService.createJob(payload);
      return res.status(201).json({
        status: 'success',
        message: 'Job created successfully',
        data: { id: job.id, jobId: job.id },
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllJobs(req, res, next) {
    try {
      const jobs = await JobsService.getAllJobs(req.query);
      return res.status(200).json({
        status: 'success',
        data: { jobs },
      });
    } catch (error) {
      next(error);
    }
  }

  async getJobById(req, res, next) {
    try {
      const job = await JobsService.getJobById(req.params.id);
      return res.status(200).json({
        status: 'success',
        data: job,
      });
    } catch (error) {
      next(error);
    }
  }

  async getJobsByCompany(req, res, next) {
    try {
      const jobs = await JobsService.getJobsByCompany(req.params.companyId);
      return res.status(200).json({
        status: 'success',
        data: { jobs },
      });
    } catch (error) {
      next(error);
    }
  }

  async getJobsByCategory(req, res, next) {
    try {
      const jobs = await JobsService.getJobsByCategory(req.params.categoryId);
      return res.status(200).json({
        status: 'success',
        data: { jobs },
      });
    } catch (error) {
      next(error);
    }
  }

  async updateJob(req, res, next) {
    try {
      const payload = { ...req.body };
      if (Object.prototype.hasOwnProperty.call(payload, 'companyId')) payload.company_id = payload.companyId;
      if (Object.prototype.hasOwnProperty.call(payload, 'categoryId')) payload.category_id = payload.categoryId;
      if (Object.prototype.hasOwnProperty.call(payload, 'salaryMin')) payload.salary_min = payload.salaryMin;
      if (Object.prototype.hasOwnProperty.call(payload, 'salaryMax')) payload.salary_max = payload.salaryMax;
      if (Object.prototype.hasOwnProperty.call(payload, 'locationType')) payload.location_type = payload.locationType;
      if (Object.prototype.hasOwnProperty.call(payload, 'jobType')) payload.job_type = payload.jobType;
      if (Object.prototype.hasOwnProperty.call(payload, 'experienceLevel')) payload.experience_level = payload.experienceLevel;

      delete payload.companyId;
      delete payload.categoryId;
      delete payload.salaryMin;
      delete payload.salaryMax;
      delete payload.locationType;
      delete payload.jobType;
      delete payload.experienceLevel;

      const job = await JobsService.updateJob(req.params.id, payload);
      return res.status(200).json({
        status: 'success',
        message: 'Job updated successfully',
        data: { jobId: job.id },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteJob(req, res, next) {
    try {
      await JobsService.deleteJob(req.params.id);
      return res.status(200).json({
        status: 'success',
        message: 'Job deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new JobsController();
