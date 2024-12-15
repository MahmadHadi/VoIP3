const socket = io("/");
const videoGrid = document.querySelector("#video-grid");
// const myPeer = new Peer(undefined, {
//     host: "/",
//     port: "3001"
// });
const myPeer = new Peer(undefined, {
    host: 'https://voip3.onrender.com', // Replace with your Render URL
    port: 443, // Render forces HTTPS on live services
    secure: true,
    path: '/peerjs'
});

socket.on("user-disconnected", (userId) => {
    console.log(userId);
    if (peers[userId]) peers[userId].close();
});

myPeer.on("open", (id) => {
    socket.emit("join-room", ROOM_ID, id);
});

const myVideo = document.createElement("video");
myVideo.muted = true;

const peers = {};

navigator.mediaDevices
    .getUserMedia({
        video: true,
        audio: true,
    })
    .then((stream) => {
        addVideoStream(myVideo, stream);

        myPeer.on("call", (call) => {
            call.answer(stream);
            const video = document.createElement("video");
            call.on("stream", (userVideoStream) => {
                addVideoStream(video, userVideoStream);
            });
        });

        socket.on("user-connected", (userId) => {
            console.log("userid", userId);
            connectToNewUser(userId, stream);
        });
    });

function connectToNewUser(userId, stream) {
    const call = myPeer.call(userId, stream);
    const video = document.createElement("video");

    call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
    });

    call.on("close", () => {
        video.remove();
    });
    peers[userId] = call;
}

function addVideoStream(video, stream) {
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
        video.play();
    });
    videoGrid.appendChild(video);
}
