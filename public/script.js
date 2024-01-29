const socket = io('/')
const videoGrid = document.getElementById('video-grid');
const myPeer = new Peer(undefined)
let screenStream;
const peers = {}
myPeer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id)
    if (screenStream) {
        socket.emit('screen-share', screenStream)
    }
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

    video.addEventListener('ended', () => {
        video.remove();
    });
}

socket.on('user-disconnected', userId => {
    console.log("Disconnected", userId);
    if (peers[userId]) {
        peers[userId].call.close()
        peers[userId].video.remove() // Remove the video element
    }
})

function connectToNewUser(userId, stream) {
    const call = myPeer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
    call.on('close', () => {
        video.remove()
    });

    // Store the call and video element in the peers object
    peers[userId] = { call, video }
}

function toggleVideoMute() {
    pop_notification("Not available yet.")
}


const stopVideoButton = document.getElementById('stop-video-button')
stopVideoButton.addEventListener('click', toggleVideoPause)
function toggleVideoPause() {
    const videoTrack = myVideo.srcObject.getVideoTracks()[0];
    if (videoTrack.enabled) {
        videoTrack.enabled = false; // Disable the video track
        let notificationContent = "Video Paused";
        stopVideoButton.innerHTML = `<i class="fas fa-video text-red-600">
        </i>
        Resume Video`
        pop_notification(notificationContent);
    } else {
        videoTrack.enabled = true; // Enable the video track
        stopVideoButton.innerHTML = `<i class="fas fa-video">
        </i>
        Stop Video`
        let notificationContent = "Video Resumed";
        pop_notification(notificationContent);
    }
}


// SCREENSHARE
const shareScreenButton = document.getElementById('share-screen-button');
shareScreenButton.addEventListener('click', shareScreen);


socket.on('screen-share', (screenStream) => {
    const screenVideo = document.createElement('video');
    addVideoStream(screenVideo, screenStream);

    myPeer.on('call', call => {
        call.answer(screenStream);

        call.on('stream', userVideoStream => {
            addVideoStream(screenVideo, userVideoStream)
        })
    });

    socket.on('user-connected', userId => {
        connectToNewUser(userId, screenStream)
    });
});


shareScreenButton.addEventListener('click', shareScreen);

async function shareScreen() {
    try {
        const screenVideo = document.createElement('video');
        screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        addVideoStream(screenVideo, screenStream);
        // connectToNewUser(ROOM_ID, screenStream)
        socket.emit('share-screen', screenStream)
    } catch (error) {
        console.error('Error sharing screen:', error);
    }
}


function stopSharing() {
    if (screenStream) {
        screenStream.getTracks().forEach(track => {
            track.stop();
        });
        screenStream = null;
        screenStream.remove()
        document.getElementById('share-screen-button').innerHTML = `<i class="fas fa-desktop"></i>
        Share Screen`;

    }
}

// socket.on('user-connected', userId => {
//     connectToNewUser(userId, screenStream)
// });


// let navigationPanel = document.getElementById('navigation-panel')
// let timeout = null;
// timeout = setTimeout(function () {
//     navigationPanel.classList.replace('scale-in-bottom', 'scale-out-bottom')
// }, 3000);
// document.addEventListener('mousemove', function () {
//     clearTimeout(timeout);
//     navigationPanel.classList.replace('scale-out-bottom', 'scale-in-bottom')
//     timeout = setTimeout(function () {
//         navigationPanel.classList.replace('scale-in-bottom', 'scale-out-bottom')
//     }, 3000);
// });