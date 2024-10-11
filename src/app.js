///////Simple connection by socketio
// import express from 'express';
// import { createServer } from 'http';
// import { Server } from 'socket.io';

// // Create an Express app
// const app = express();

// // Create an HTTP server
// const server = createServer(app);

// // Initialize Socket.IO on the server
// const io = new Server(server, {
//     cors: {
//         origin: "http://localhost:3000", // The URL of your React app
//         methods: ["GET", "POST"]
//     }
// });

// // Listen for connection events
// io.on('connection', (socket) => {
//     console.log('New client connected:', socket.id);

//     // Listen for messages from the client
//     socket.on('message', (msg) => {
//         console.log('Message from client:', msg);
      
        
//         // Send a message back to the client/frontend side
//         socket.emit('message', 'Hello client!');
//         console.log(msg);
//     });

//     // Handle client disconnection
//     socket.on('disconnect', () => {
//         console.log('Client disconnected:', socket.id);
//     });
// });

// // Start the server on port 8080
// server.listen(8080, () => {
//     console.log('Server is running on http://192.168.29.16:8080');
// });

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import model from './schema/model.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
}});

// connection of 
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // User selects a country
    socket.on('join_country', async (country) => {
        socket.join(country);
        console.log(`${socket.id} joined ${country} chat`);

        // Fetch chat history from DB for that country
        const chatHistory = await model.find({ country }).sort({ timestamp: 1 });
        socket.emit('chat_history', chatHistory); // Send history to client
    });

    // When user sends a message
    socket.on('send_message', async ({ username, country, message }) => {
        const newMessage = new model({ username, country, message });
        await newMessage.save(); // Save message in DB

        // Broadcast the message only to the specific country room
        io.to(country).emit('receive_message', newMessage);
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

// Start server
const PORT = process.env.SERVER_PORT || 8000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
