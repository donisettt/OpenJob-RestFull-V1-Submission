require('dotenv').config();
const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
  }

  getTransporter() {
    if (this.transporter) return this.transporter;

    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: parseInt(process.env.MAIL_PORT || '587', 10),
      secure: process.env.MAIL_PORT === '465',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    return this.transporter;
  }

  async sendApplicationNotification({ ownerEmail, applicantName, applicantEmail, appliedAt }) {
    if (!process.env.MAIL_HOST || !process.env.MAIL_USER || !process.env.MAIL_PASSWORD) {
      console.log('Mail credentials are not configured. Notification email skipped.');
      return;
    }

    await this.getTransporter().sendMail({
      from: process.env.MAIL_USER,
      to: ownerEmail,
      subject: 'New job application received',
      text: [
        'A new candidate has applied to your job.',
        `Applicant name: ${applicantName}`,
        `Applicant email: ${applicantEmail}`,
        `Application date: ${appliedAt}`,
      ].join('\n'),
    });
  }
}

module.exports = new EmailService();
