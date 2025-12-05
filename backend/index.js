import express from 'express';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { Server } from 'socket.io';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { signup, login, authenticateToken } from "./Controllers/authController.js"
import Message from './models/message.js'
import jwt from 'jsonwebtoken';

dotenv.config();

const mongoURL = process.env.url
mongoose.connect(mongoURL).then(()=>{console.log("MongoDB connected!")})
.catch((err)=>{console.log("Connection Error! - ", err)});

const app = express();
app.use(express.json());

  const server = createServer(app);
  const currDir = dirname(fileURLToPath(import.meta.url));
  const parDir = dirname(currDir);
  const io = new Server(server, {
    connectionStateRecovery: {}
  });

  app.get('/', (req, res) => {
      res.sendFile(join(parDir, '/frontend/index.html'))
  })

  app.post('/users/signup',signup);
  app.post('/users/login',login);
  app.get('/posts', authenticateToken, (req, res)=>{console.log("This is verified!"); res.status(200).json("This is verified!")});

  io.use((socket, next)=>{
    const token = socket.handshake.auth.token;
    jwt.verify(token, process.env.SECRET_KEY, (err, user)=>{
      if (err) return next(new Error("Authentication Error!"))

      socket.user = user
      next()
    })
  })

  io.on('connection', async(socket) => {

    console.log('Client Connected: ', socket.id)

      socket.on('chat message', async(msg, callback) => {
          let result;
          console.log('Received Message on server: ', msg)
          try{
              const message = await Message.create({
                sender: socket.user.id,
                content: msg
              })
              result = await message.populate("sender", "username")

              io.emit('chat message', message.content, message.createdAt);
              callback();
          }
          catch (e) { 
            return; 
          }  
      }

    )

      if (!socket.recovered) {
      // if the connection state recovery was not successful

      try {
        // await 
        // db.each('SELECT id, content FROM messages WHERE id > ?',
        //   [socket.handshake.auth.serverOffset || 0],
        //   (_err, row) => {
        //     socket.emit('chat message', row.content, row.id);
        //   }
        // )
        const since = socket.handshake.auth.serverTimeStamp ? new Date(socket.handshake.auth.serverTimeStamp) : 0;
        const messages = await Message.find({
            createdAt: {$gt: since }
        })
        .sort({createdAt: 1})
        .limit(500)

        messages.forEach(element => {
          socket.emit('chat message', element.content, element.createdAt)
        });
      } catch (e) {
        // something went wrong
        console.error(e)
      }
    }
  })


  server.listen(process.env.PORT, () => {
      console.log(`server running at http://localhost:${process.env.PORT}`);
  })

// io.on('connection', (socket) => {
//       socket.on('chat message', (msg) => {
//     console.log('message: ' + msg);
//   });
// });

// io.on('connection', (socket) => {
//     socket.on('chat message', (msg) => {
//         io.emit('chat message', msg)
//     })
// }