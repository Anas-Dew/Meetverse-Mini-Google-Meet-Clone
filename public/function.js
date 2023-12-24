const pop_notification = (content) => {
    const noti = document.createElement("span")
    noti.classList.add('slide-in-left')
    noti.classList.add('notification-pop')
    noti.innerText = content

    document.body.append(noti)

    setTimeout(() => {
        noti.classList.replace('slide-in-left', 'slide-out-left')
    }, 2500);
    setTimeout(() => {
        noti.remove();
    }, 5000);
}

const inviteOthers = () => {
    window.navigator.clipboard.writeText(window.location.href);
    pop_notification('Invite link copied!')
};

const leaveMeeting = () => {
    document.getElementById('leaving-room-div').classList.replace('hidden', 'flex')
    document.getElementById('leaving-room-div').classList.add('swing-in-left-bck')
    setTimeout(() => {
        window.location.href = '/meeting-left'
    }, 3000);
}

const BrightMode = () => {
    document.getElementById('body').classList.toggle('bg-white');
    document.getElementById('navigation-panel').classList.toggle('bg-[#a9a9a9]');
    document.getElementById('bright-mode-div').classList.replace('hidden', 'flex');
    document.getElementById('sun-icon').classList.add('rotate-center');
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen(); 
      }
    }
    
    setTimeout(() => {
        document.getElementById('bright-mode-div').classList.replace('flex', 'hidden');

    }, 1500);
}