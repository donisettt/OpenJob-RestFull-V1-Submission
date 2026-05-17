const ApplicationsService = require('../services/ApplicationsService');

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
      return res.status(201).json({
        status: 'success',
        message: 'Application submitted successfully',
        data: { id: application.id, applicationId: application.id },
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
      const application = await ApplicationsService.getApplicationById(req.params.id);
      return res.status(200).json({
        status: 'success',
        data: application, // Postman expects flattened object directly in data or not wrapped in another object usually
      });
    } catch (error) {
      next(error);
    }
  }

  async getApplicationsByUser(req, res, next) {
    try {
      const applications = await ApplicationsService.getApplicationsByUser(req.params.userId);
      return res.status(200).json({
        status: 'success',
        data: { applications },
      });
    } catch (error) {
      next(error);
    }
  }

  async getApplicationsByJob(req, res, next) {
    try {
      const applications = await ApplicationsService.getApplicationsByJob(req.params.jobId);
      return res.status(200).json({
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
      const application = await ApplicationsService.updateApplicationStatus(req.params.id, status);
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
      await ApplicationsService.deleteApplication(req.params.id);
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
