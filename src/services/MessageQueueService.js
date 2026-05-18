require('dotenv').config();
const amqp = require('amqplib');

const QUEUE_NAME = 'application_notifications';

class MessageQueueService {
  getUrl() {
    if (process.env.AMQP_URL) return process.env.AMQP_URL;

    const host = process.env.RABBITMQ_HOST || 'localhost';
    const port = process.env.RABBITMQ_PORT || 5672;
    const user = encodeURIComponent(process.env.RABBITMQ_USER || 'guest');
    const password = encodeURIComponent(process.env.RABBITMQ_PASSWORD || 'guest');
    return `amqp://${user}:${password}@${host}:${port}`;
  }

  async createChannel() {
    const connection = await amqp.connect(this.getUrl(), { timeout: 1000 });
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });
    return { connection, channel };
  }

  async publishApplicationCreated(applicationId) {
    let connection;
    try {
      const created = await this.createChannel();
      connection = created.connection;
      const { channel } = created;
      const payload = { application_id: applicationId };
      channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(payload)), {
        persistent: true,
      });
      await channel.close();
    } catch (error) {
      console.error('RabbitMQ publish failed:', error.message);
    } finally {
      if (connection) await connection.close().catch(() => {});
    }
  }
}

module.exports = {
  QUEUE_NAME,
  MessageQueueService: new MessageQueueService(),
};
