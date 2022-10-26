// note: this needs to be ran through webserver like MAMP or node.js

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
      // set the source object to be the localMediaStream
      video.srcObject = localMediaStream;
      video.play();
    })
    .catch((err) => {
      console.error(
        "Oh No! There has been an error. Maybe try allowing the webcam?",
        err
      );
    });
}

function paintToCanvas() {
  // declare varibles for the width and height of video
  const width = video.videoWidth;
  const height = video.videoHeight;
  // set the size of canvas to be same as video
  canvas.width = width;
  canvas.height = height;

  // every 16 seconds, paint the frame to the canvas element
  // we return in case we ever want to "clearInterval()" to stop it.
  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);
    // take the pixels out
    let pixels = ctx.getImageData(0, 0, width, height);
    // mess with them
    // pixels = redEffect(pixels);

    pixels = rgbSplit(pixels);
    // ctx.globalAlpha = 0.8;

    // pixels = greenScreen(pixels);
    // put them back
    ctx.putImageData(pixels, 0, 0);
  }, 16);
}

function takePhoto() {
  // play the sound
  snap.currentTime = 0;
  snap.play();
  // take the data out of the canvas
  const data = canvas.toDataURL("image/jpeg");
  // create a link
  const link = document.createElement("a");
  // set the href of that link equal to whatever is in our data const
  link.href = data;
  // set these two Attributes. Handsome is the name of the image on your hardrive once you take the photo.
  link.setAttribute("download", "handsome");
  // set the text of link to be Download Image
  link.innerHTML = `<img src="${data}" alt = "Handsome Man" />`;
  // put it in the HTML
  strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels) {
  // iterate through all pixels. must used data.length because pixels is itself not an actual array.
  for (let i = 0; i < pixels.data.length; i += 4) {
    // the 0 is the red, add 50 to it
    pixels.data[i + 0] = pixels.data[i + 0] + 50; // r
    // the 1 is Green, subtract 50
    pixels.data[i + 1] = pixels.data[i + 1] - 50; // g
    // the 2 is blud, multiply it by 0.5
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // b
    // we actually don't mess with the 3 which would be the alpha
  }
  // return those out
  return pixels;
}

function rgbSplit(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 150] = pixels.data[i + 0]; // RED
    pixels.data[i + 500] = pixels.data[i + 1]; // GREEN
    pixels.data[i - 550] = pixels.data[i + 2]; // Blue
    // we actually don't mess with the 3 which would be the alpha
  }

  return pixels;
}

function greenScreen(pixels) {
  // levels object will hold min and max green
  const levels = {};

  // grab every rgb input
  document.querySelectorAll(".rgb input").forEach((input) => {
    levels[input.name] = input.value;
  });

  console.log(levels);

  for (i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    if (
      red >= levels.rmin &&
      green >= levels.gmin &&
      blue >= levels.bmin &&
      red <= levels.rmax &&
      green <= levels.gmax &&
      blue <= levels.bmax
    ) {
      // take it out!
      pixels.data[i + 3] = 0;
    }
  }

  return pixels;
}

getVideo();

video.addEventListener("canplay", paintToCanvas);
