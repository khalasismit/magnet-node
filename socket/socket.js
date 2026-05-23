import { Server } from "socket.io";
import express from "express";
import http from "http";

export const app = express();
export const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: ["*", "http://localhost:3001", "http://localhost:3000", "https://storage.googleapis.com"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["*"]
  }
});

// Use Map instead of a plain object to completely avoid bracket object injection and prototype pollution
const users = new Map();

io.on('connection', (socket) => {
  socket.on('connect', () => {
    console.log(`New connection ${socket.id}`);
  });

  socket.on('authenticate', (userId) => {
    console.log("user added to users:", userId);
    
    // Ensure userId is a string to prevent non-string injection vectors
    if (typeof userId !== 'string') {
      console.log("Invalid userId type during authentication");
      return;
    }

    if (users.has(userId)) {
      console.log(`User ${userId} already has a socket ID associated with it`);
      // we disconnect the previous socket here
      io.to(users.get(userId)).emit('forceDisconnect', 'You have been disconnected due to a new connection');
      users.delete(userId); // Remove previous socket ID
    }
    users.set(userId, socket.id);
    console.log("Current authenticated users count:", users.size);
  });

  socket.on('send_message', (data) => {
    const { receiverId, message } = data;
    if (typeof receiverId !== 'string') return;

    // Find the recipient's socket ID
    const recipientSocketId = users.get(receiverId);
    
    // If recipient's socket ID is found, emit the message directly to that socket
    if (recipientSocketId) {
      console.log("receiver socketId:", recipientSocketId);
      io.to(recipientSocketId).emit('receive_message', message.NewMessage);
      console.log(`message sent to receiver :${receiverId}`);
    } else {
      // Handle case where recipient is not connected or does not exist
      console.log(`User ${receiverId} is not connected`);
    }
  });

  socket.on('like', (data) => {
    const { newNotif } = data;
    if (!newNotif || !newNotif._doc) return;
    
    const receiverId = newNotif._doc.receiverId;
    if (typeof receiverId !== 'string') return;

    const recipientSocketId = users.get(receiverId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('notification', newNotif);
      console.log(`notification sent to receiver :${receiverId}`);
    } else {
      // Handle case where recipient is not connected or does not exist
      console.log(`User ${receiverId} is not connected`);
    }
  });

  socket.on('disconnect', () => {
    // Find the user ID associated with the disconnected socket
    let disconnectedUserId = null;
    for (const [userId, socketId] of users.entries()) {
      if (socketId === socket.id) {
        disconnectedUserId = userId;
        break;
      }
    }

    if (disconnectedUserId) {
      users.delete(disconnectedUserId); // Remove the user's entry from the users object
      console.log(`User ${disconnectedUserId} disconnected`);
    }
  });
});
