import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import { sendMail } from "./utils.js";
import cron from "node-cron";
const PORT = 8000;

const app = express();
app.use(express.json());
const server = createServer(app);

app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});


io.on("connection", (socket) => {
  console.log("a user connected");
  console.log(socket.id);
  socket.emit("welcome", `Welcome to the chat ${socket.id}`);
  socket.broadcast.emit("welcome", `${socket.id} has joined the chat`);
  // socket.on("disconnect", () => {
  //   console.log(`user disconnected ${socket.id}`);
  //   socket.broadcast.emit("welcome", `${socket.id} has left the chat`);
  // });
//   socket.on("chat", ({room, message}) => {
//     console.log({room, message});
//     // socket.broadcast .emit("recieved-message", {room, message}); //this send to all the clients except the sender
//     io.to(room).emit("recieved-message", message); //this send to the sender
//   });
app.set('socket', socket);
});


app.get("/", (req, res) => {
  res.send("<h1>API is working!!!</h1>");
});
app.post("/send-mail", async (req, res) => {
  console.log("Data", req.body);
  const givenTime = new Date(req.body.time);

  const minute = givenTime.getMinutes();
  const hour = givenTime.getHours();
  const day = givenTime.getDate();
  const month = givenTime.getMonth() + 1; // JavaScript months are 0-11
  const year = givenTime.getFullYear();
  console.log(minute, hour, day, month, year)
  
  cron.schedule(`${minute} ${hour} ${day} ${month} *`, async () => {
    const currentYear = new Date().getFullYear();
    if (currentYear === year) {
      const sentMail = await sendMail(req.body.email);
      if(sentMail){
        const socket = app.get('socket');
        socket.emit('mail-sent', true);
        return res.send("Mail sent");
      }
    }
  });
});
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

