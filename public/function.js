const inviteOthers = () => {
    window.navigator.clipboard.writeText(window.location.href);
    alert('Invite link copied');    
};

const leaveMeeting = () => {
    window.location.href = '/meeting-left'
}