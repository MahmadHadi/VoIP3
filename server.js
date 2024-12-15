// const express = require("express");
// const app = express();
// const server = require("http").Server(app);
// const io = require("socket.io")(server);
// const { v4: uuidv4 } = require("uuid");

// // const port = 3000;
// const PORT = process.env.PORT || 3000; // Default to 3000 for local dev


// app.set("view engine", "ejs");
// app.use(express.static("public"));

// app.get("/", (req, resp) => {
//     resp.redirect(`/${uuidv4()}`);
// });

// app.get("/:room", (req, resp) => {
//     resp.render("room", { roomId: req.params.room });
// });

// io.on("connection", (socket) => {
//     socket.on("join-room", (roomId, userId) => {
//         console.log(roomId, userId);
//         socket.join(roomId);
//         socket.to(roomId).broadcast.emit("user-connected", userId);

//         socket.on("disconnect", () => {
//             socket.to(roomId).broadcast.emit('user-disconnected', userId)
//         })
//     });

// });

// server.listen(PORT);

// ! --

const express = require("express");
const cors = require("cors"); // Import cors for handling CORS issues
const { Server } = require("http");
const { Server: SocketIOServer } = require("socket.io");
const { v4: uuidv4 } = require("uuid");

const app = express();
const server = Server(app);
const io = new SocketIOServer(server, {
    cors: {
        origin: "*", // Allow all origins; replace with specific origin if needed
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 3000; // Default to 3000 for local dev

// Set view engine and static folder
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(cors()); // Use CORS middleware

// Route to generate a unique room
app.get("/", (req, resp) => {
    resp.redirect(`/${uuidv4()}`);
});

// Route for specific room
app.get("/:room", (req, resp) => {
    resp.render("room", { roomId: req.params.room });
});

// WebSocket connections
io.on("connection", (socket) => {
    console.log("New connection established");

    socket.on("join-room", (roomId, userId) => {
        console.log(`User ${userId} joined room ${roomId}`);
        socket.join(roomId);
        socket.to(roomId).emit("user-connected", userId);

        socket.on("disconnect", () => {
            console.log(`User ${userId} disconnected from room ${roomId}`);
            socket.to(roomId).emit("user-disconnected", userId);
        });
    });
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
