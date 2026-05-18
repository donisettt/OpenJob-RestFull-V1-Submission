require('dotenv').config();
const { QUEUE_NAME, MessageQueueService } = require('./services/MessageQueueService');
const ApplicationsService = require('./services/ApplicationsService');
const EmailService = require('./services/EmailService');
const pool = require('./config/database');

const startConsumer = async () => {
  const { connection, channel } = await MessageQueueService.createChannel();

  process.on('SIGINT', async () => {
    await channel.close().catch(() => {});
    await connection.close().catch(() => {});
    await pool.end().catch(() => {});
    process.exit(0);
  });

  await channel.consume(QUEUE_NAME, async (message) => {
    if (!message) return;

    try {
      const payload = JSON.parse(message.content.toString());
      const data = await ApplicationsService.getApplicationNotificationData(payload.application_id);

      await EmailService.sendApplicationNotification({
        ownerEmail: data.owner_email,
        applicantName: data.applicant_name,
        applicantEmail: data.applicant_email,
        appliedAt: data.created_at,
      });

      channel.ack(message);
    } catch (error) {
      console.error('Failed to process RabbitMQ message:', error.message);
      channel.nack(message, false, false);
    }
  });

  console.log(`Consumer is listening on RabbitMQ queue "${QUEUE_NAME}"`);
};

startConsumer().catch(async (error) => {
  console.error('Consumer failed to start:', error.message);
  await pool.end().catch(() => {});
  process.exit(1);
});
