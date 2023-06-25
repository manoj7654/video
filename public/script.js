const socket = io("/");
const videoGrid = document.getElementById("video_grid");
const myPeer = new Peer(undefined, {
    host: "/",
    port: "3001",
});

const myVideo = document.createElement("video");
myVideo.classList.add("design")

myVideo.muted = true;

let audiotoggle = true;
let videotoggle = true;

const peers = {};

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    addVideoStream(myVideo, stream);

    myPeer.on('call', call => {
        call.answer(stream);
        const video = document.createElement('video');
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream);
        });
    });
    //==========================================================================================
    // Toggle Audio Button
    const audioBtn = document.getElementById("audio");
    audioBtn.addEventListener("click", () => {
        audiotoggle = !audiotoggle;
        OnOffAudio(audiotoggle);
        updateButtonColor(audioBtn, audiotoggle);
    });

    // Toggle Camera Button
    const cameraBtn = document.getElementById("camera");
    cameraBtn.addEventListener("click", () => {
        videotoggle = !videotoggle;
        OnOffVideo(videotoggle);
        updateButtonColor(cameraBtn, videotoggle);
    });
    function OnOffAudio(state) {
        myVideo.srcObject.getAudioTracks()[0].enabled = state;
    }

    function OnOffVideo(state) {
        myVideo.srcObject.getVideoTracks()[0].enabled = state;
    }

    function updateButtonColor(button, state) {
        if (state) {
            button.style.backgroundColor = "blue";
        } else {
            button.style.backgroundColor = "red";
        }
    }
//======================================================================================
socket.on('userConnected', userId => {
    connectToNewUser(userId, stream);
});
})

myPeer.on('open', id => {
socket.emit('join-room', ROOM_ID, id);
});
socket.on('userDisconnected', userId => {
    if (peers[userId]) {
        peers[userId].close();
    }
});


function addVideoStream(video, stream) {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    });
    videoGrid.append(video);
}


function connectToNewUser(userId, stream) {
    const call = myPeer.call(userId, stream);
    const video = document.createElement('video');
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream);
    });
    call.on('close', () => {
        video.remove();
    })
    peers[userId] = call;
}