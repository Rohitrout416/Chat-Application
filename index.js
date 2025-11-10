import express from 'express';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { Server } from 'socket.io';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import dotenv from 'dotenv';
const db = await open({
    filename: 'chat_05-10-25.db',
    driver: sqlite3.Database
})

await db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_offset TEXT UNIQUE,
    content TEXT)
    `);
  

  const app = express();
  const server = createServer(app);
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const io = new Server(server, {
    connectionStateRecovery: {}
  });

  app.get('/', (req, res) => {
      res.sendFile(join(__dirname, 'index.html'))
  })


  io.on('connection', async(socket) => {

    console.log('Client Connected: ', socket.id)

      socket.on('chat message', async(msg, callback) => {
          let result;
          console.log('Received Message on server: ', msg)
          try{
              result = await db.run('INSERT INTO messages (content) VALUES (?)', msg);
          }
          catch (e) { 
            return; 
          }

          io.emit('chat message', msg, result.lastID);
          callback();
      }

    )

      if (!socket.recovered) {
      // if the connection state recovery was not successful

      try {
        await db.each('SELECT id, content FROM messages WHERE id > ?',
          [socket.handshake.auth.serverOffset || 0],
          (_err, row) => {
            socket.emit('chat message', row.content, row.id);
          }
        )
      } catch (e) {
        // something went wrong
      }
    }
  })

  dotenv.config();

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