const video = document.querySelector(".player");
const canvas = document.querySelector(".photo");
const ctx = canvas.getContext("2d");
const strip = document.querySelector(".strip");
const snap = document.querySelector(".snap");

function getVideo() {
  // prompts the user for permission to use a media input (like a video) and produces a MediaStream with tracks containing the requested media.
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    // with a promise, we have a .then
    .then((localMediaStream) => {
      console.log(localMediaStream);
    });
}

getVideo();
