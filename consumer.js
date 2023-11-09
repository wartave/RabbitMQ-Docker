import { connect } from "amqplib";
import { connectionParams, queue } from "./config_.js";

async function consume() {
  try {
    const connection = await connect(connectionParams);
    const channel = await connection.createChannel();
    await channel.assertQueue(queue);
    channel.consume(queue, (message) => {
      console.log('Mensaje recibido:', message.content.toString());
      channel.ack(message); 
    });
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

consume();
