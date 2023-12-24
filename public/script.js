const socket = io('/')
const videoGrid = document.getElementById('video-grid');
const myPeer = new Peer(undefined)

const peers = {}
myPeer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id)
})


const myVideo = document.createElement('video')
myVideo.muted = true;

navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true
}).then(stream => {
    addVideoStream(myVideo, stream)

    myPeer.on('call', call => {
        call.answer(stream);
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    })
    socket.on('user-connected', userId => {
        connectToNewUser(userId, stream)
    });


})

function addVideoStream(video, stream) {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })

    video.classList.add('scale-in-center')
    videoGrid.append(video)

}

socket.on('user-disconnected', userId => {
    console.log("Disconnected", userId);
    if (peers[userId]) {
        peers[userId].close()
    }
})

function connectToNewUser(userId, stream) {
    const call = myPeer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
    peers[userId] = call

    call.on('close', () => {
        video.remove()
    });
}

function toggleVideoMute() {
    myVideo.muted = !myVideo.muted;
    console.log("Mic", myVideo.muted);
}