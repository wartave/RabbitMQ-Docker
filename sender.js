import { connect } from "amqplib";
import Fastify from 'fastify' 
import fastifyFormBody from '@fastify/formbody';


import { connectionParams, queue } from "./config_.js";
const fastify = Fastify({
  logger: true,
})

fastify.register(fastifyFormBody);
fastify.get("/", (req, res) => {
  res.type('text/html').send(`
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          margin: 0;
        }
        form {
          border: 1px solid #ccc;
          padding: 20px;
          border-radius: 5px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        input {
          padding: 8px;
          margin-right: 8px;
          border: 1px solid #ccc;
          border-radius: 3px;
        }
        button {
          padding: 8px 16px;
          background-color: #4caf50;
          color: white;
          border: none;
          border-radius: 3px;
          cursor: pointer;
        }
        button:hover {
          background-color: #45a049;
        }
      </style>
    </head>
    <body>
      
      <form action="/send" method="POST">
      <h3>Victor Jose Taveras 1-17-1007</h3>
        <input type="text" name="message" />
        <button type="submit">Send</button>
      </form>
    </body>
  </html>
`);
});

fastify.post("/send", async (req, res) => {
  try {
    const connection = await connect(connectionParams);
    const channel = await connection.createChannel();

    const message = req.body.message;

    await channel.assertQueue(queue);
    channel.sendToQueue(queue, Buffer.from(message));
    console.log('Mensaje enviado:', message);
    const successMessage = "Mensaje enviado exitosamente";
    res.type('text/html').send(`
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
            }
            .message-container {
              text-align: center;
            }
            button {
              padding: 8px 16px;
              background-color: #4caf50;
              color: white;
              border: none;
              border-radius: 3px;
              cursor: pointer;
              margin-top: 10px;
            }
            button:hover {
              background-color: #45a049;
            }
          </style>
        </head>
        <body>
          <div class="message-container">
            <p>${successMessage}</p>
            <button onclick="window.history.back()">Regresar</button>
          </div>
        </body>
      </html>
    `);
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
    res.send('Error al enviar el mensaje');
  }
});

fastify.listen({port: 3000}, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log("Sender app listening on port 3000");
});
