
const socket = io('/');

const videoGrid = document.getElementById('video-grid');

const myVideo = document.createElement('video');

const participants = { }

myVideo.muted = true;

let myVideoStream;

const peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '3030'
}); 


navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    peer.on('call', call => {
        call.answer(stream);
        const video = document.createElement('video');
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    });
    // here
    socket.on("user-connected", (userId) => {
        // participants[userId] = 'danut';
        // console.log("user connected: ", participants[userId]);
        setTimeout(function ()
          {
            connectToNewUser(userId, stream);
          },1000)
        })

        let msg = $('input');
        console.log(msg);

        $('html').keydown((e) => {
            if(e.which == 13 && msg.val.length !== 0) {
                console.log(msg.val());

                socket.emit('message', msg.val());
                msg.val('');
            }
        })



      socket.on('create-message', (message, userId) => {
        console.log('this is coming from server: ',message, ' and the user id is: ',userId);
        $('ul').append(`<li class="message"><b>user: </b>${message}</li>`)
        scrollToBottom();
    })



})


peer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id);
})


const connectToNewUser = (userId, stream) => {
    const call = peer.call(userId, stream);
    const video = document.createElement('video');
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream);
    })
}


const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    videoGrid.append(video);
}

const scrollToBottom = () => {
    let d = $('.main__chat__window');
    d.scrollTop(d.prop('scrollHeight'));
}

//mute and unmute audio
const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
    } else {
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled = true;
    }
}

const setMuteButton = () => {
    const html = `
      <i class="fas fa-microphone"></i>
      <span>Mute</span>
    `
    document.querySelector('.main__mute__button').innerHTML = html;
  }
  
  const setUnmuteButton = () => {
    const html = `
      <i class="unmute fas fa-microphone-slash"></i>
      <span>Unmute</span>
    `
    document.querySelector('.main__mute__button').innerHTML = html;
  }


  //stop video
  const playStop = () => {
      const enabled = myVideoStream.getVideoTracks()[0].enabled;
      if (enabled) {
        myVideoStream.getVideoTracks()[0].enabled = false;
        setPlayVideo();
      } else {
        setStopVideo();  
        myVideoStream.getVideoTracks()[0].enabled = true;
      }
  }

  const setStopVideo = () => {
    const html = `
      <i class="fas fa-video"></i>
      <span>Stop Video</span>
    `
    document.querySelector('.main__video__button').innerHTML = html;
  }
  
  const setPlayVideo = () => {
    const html = `
    <i class="stop fas fa-video-slash"></i>
      <span>Play Video</span>
    `
    document.querySelector('.main__video__button').innerHTML = html;
  }