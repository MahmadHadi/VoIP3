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

// ! ---

const express = require("express");
const app = express();
const server = require("http").Server(app);
const socketIo = require("socket.io");
const { v4: uuidv4 } = require("uuid");

const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, resp) => {
    resp.redirect(`/${uuidv4()}`);
});

app.get("/:room", (req, resp) => {
    resp.render("room", { roomId: req.params.room });
});

const io = socketIo(server, {
    cors: {
        origin: "*",
    },
});

io.on("connection", (socket) => {
    socket.on("join-room", (roomId, userId) => {
        console.log(roomId, userId);
        socket.join(roomId);
        socket.to(roomId).broadcast.emit("user-connected", userId);

        socket.on("disconnect", () => {
            socket.to(roomId).broadcast.emit("user-disconnected", userId);
        });
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
