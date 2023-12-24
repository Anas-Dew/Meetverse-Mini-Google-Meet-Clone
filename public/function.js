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
    window.location.href = '/meeting-left'
}
