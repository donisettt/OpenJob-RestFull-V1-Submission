const ApplicationsService = require('../services/ApplicationsService');
const CacheService = require('../services/CacheService');
const { MessageQueueService } = require('../services/MessageQueueService');

class ApplicationsController {
  async createApplication(req, res, next) {
    try {
      const payload = {
        ...req.body,
        job_id: req.body.job_id || req.body.jobId,
        document_id: req.body.document_id || req.body.documentId,
        cover_letter: req.body.cover_letter || req.body.coverLetter,
        user_id: req.user.id
      };
      const application = await ApplicationsService.createApplication(payload);
      await CacheService.delete(
        CacheService.keys.applicationsByUser(application.user_id),
        CacheService.keys.applicationsByJob(application.job_id)
      );
      MessageQueueService.publishApplicationCreated(application.id);

      return res.status(201).json({
        status: 'success',
        message: 'Application submitted successfully',
        data: {
          id: application.id,
          applicationId: application.id,
          user_id: application.user_id,
          job_id: application.job_id,
          status: application.status,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllApplications(req, res, next) {
    try {
      const applications = await ApplicationsService.getAllApplications();
      return res.status(200).json({
        status: 'success',
        data: { applications },
      });
    } catch (error) {
      next(error);
    }
  }

  async getApplicationById(req, res, next) {
    try {
      const cacheKey = CacheService.keys.application(req.params.id);
      const cachedApplication = await CacheService.get(cacheKey);
      if (cachedApplication) {
        return res
          .set('X-Data-Source', 'cache')
          .status(200)
          .json({
            status: 'success',
            data: cachedApplication,
          });
      }

      const application = await ApplicationsService.getApplicationById(req.params.id);
      await CacheService.set(cacheKey, application);
      return res
        .set('X-Data-Source', 'database')
        .status(200)
        .json({
          status: 'success',
          data: application,
        });
    } catch (error) {
      next(error);
    }
  }

  async getApplicationsByUser(req, res, next) {
    try {
      const cacheKey = CacheService.keys.applicationsByUser(req.params.userId);
      const cachedApplications = await CacheService.get(cacheKey);
      if (cachedApplications) {
        return res
          .set('X-Data-Source', 'cache')
          .status(200)
          .json({
            status: 'success',
            data: { applications: cachedApplications },
          });
      }

      const applications = await ApplicationsService.getApplicationsByUser(req.params.userId);
      await CacheService.set(cacheKey, applications);
      return res
        .set('X-Data-Source', 'database')
        .status(200)
        .json({
          status: 'success',
          data: { applications },
        });
    } catch (error) {
      next(error);
    }
  }

  async getApplicationsByJob(req, res, next) {
    try {
      const cacheKey = CacheService.keys.applicationsByJob(req.params.jobId);
      const cachedApplications = await CacheService.get(cacheKey);
      if (cachedApplications) {
        return res
          .set('X-Data-Source', 'cache')
          .status(200)
          .json({
            status: 'success',
            data: { applications: cachedApplications },
          });
      }

      const applications = await ApplicationsService.getApplicationsByJob(req.params.jobId);
      await CacheService.set(cacheKey, applications);
      return res
        .set('X-Data-Source', 'database')
        .status(200)
        .json({
          status: 'success',
          data: { applications },
        });
    } catch (error) {
      next(error);
    }
  }

  async updateApplicationStatus(req, res, next) {
    try {
      const { status } = req.body;
      const existingApplication = await ApplicationsService.getApplicationById(req.params.id);
      const application = await ApplicationsService.updateApplicationStatus(req.params.id, status);
      await CacheService.delete(
        CacheService.keys.application(req.params.id),
        CacheService.keys.applicationsByUser(existingApplication.user_id),
        CacheService.keys.applicationsByJob(existingApplication.job_id)
      );
      return res.status(200).json({
        status: 'success',
        message: 'Application status updated',
        data: { applicationId: application.id },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteApplication(req, res, next) {
    try {
      const existingApplication = await ApplicationsService.getApplicationById(req.params.id);
      await ApplicationsService.deleteApplication(req.params.id);
      await CacheService.delete(
        CacheService.keys.application(req.params.id),
        CacheService.keys.applicationsByUser(existingApplication.user_id),
        CacheService.keys.applicationsByJob(existingApplication.job_id)
      );
      return res.status(200).json({
        status: 'success',
        message: 'Application deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ApplicationsController();
