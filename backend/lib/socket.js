const {Server} = require("socket.io");
const express = require("express");
const http = require("http")

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors:{
        origin:["http://localhost:5173"]
    },
})

//used to store online users
const userSocketMap = {}  //SInce object hence stired in form of data value pair {userId: socketId}

function getReceiverSocketId(userId){
    return userSocketMap[userId];
}

io.on("connection", (socket)=>{
    console.log("A user connected", socket.id);

    const userId = socket.handshake.query.userId;
    if(userId) userSocketMap[userId] = socket.id;

    //io.emit() is used to send events to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap))

    socket.on("disconnect", ()=>{
        console.log("A user disconnected", socket.id);
        delete userSocketMap[userId]
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    })
})

module.exports = {io, app, server, getReceiverSocketId}


// io.emit(...) is server → all clients
//socket.on(...) is client listening for that event