/////////////////////////////////////
// Get our Elements
const myDocument = document.documentElement;
const player = document.querySelector(".player");
const playerControls = player.querySelector(".player__controls");
const video = player.querySelector(".viewer");
const progress = player.querySelector(".progress");
const progressBar = player.querySelector(".progress__filled");
const toggle = player.querySelector(".toggle");
const skipButtons = player.querySelectorAll("[data-skip]");
const ranges = player.querySelectorAll(".player__slider");
const currentTimeElement = player.querySelector(".current");
const durationTimeElement = player.querySelector(".duration");
const fullScreen = player.querySelector(".fullScreen");

///////////////////////////////////////
// Build our functions
let isPlaying = false;

function togglePlay() {
  if (!isPlaying) {
    video.play();
    isPlaying = !isPlaying;
  } else {
    video.pause();
    isPlaying = !isPlaying;
  }
}

// added functionality for hitting the "p" key to play or pause
function togglePlayKey(e) {
  if (e.key === "p" && isPlaying === true) {
    video.pause();
    isPlaying = !isPlaying;
  } else if (e.key === "p" && isPlaying === false) {
    video.play();
    isPlaying = !isPlaying;
  }
}

function updateButton() {
  // if icon is paused, put in the play icon, else put in the pause icon
  const icon = this.paused ? "►" : "❚ ❚";
  // change teh textContent of the element of class toggle to the value inside icon
  toggle.textContent = icon;
}

function skip() {
  video.currentTime += parseFloat(this.dataset.skip);
}

function handleRangeUpdate() {
  //video.playback or video.volume will be equal to whatever value we land on (this.value)
  video[this.name] = this.value;
}

function handleProgress() {
  // remember this trick. This allows us to get the correct percent
  const percent = (video.currentTime / video.duration) * 100;
  progressBar.style.flexBasis = `${percent}%`;
}

function scrub(e) {
  // e.offsetX is a property of e(which is the event) then, divide that by the width of the progressbar and multiply it by the length of the video
  const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
  // set the video current time equal to the scrubTime;
  video.currentTime = scrubTime;
}

// Added the current time and duration apart from video
function currentTime() {
  let currentMinutes = Math.floor(video.currentTime / 60);
  let currentSeconds = Math.floor(video.currentTime - currentMinutes * 60);
  let durationMinutes = Math.floor(video.duration / 60);
  let durationSeconds = Math.floor(video.duration - durationMinutes * 60);

  currentTimeElement.innerHTML = `${currentMinutes}:${currentSeconds}`;
  durationTimeElement.innerHTML = `${durationMinutes}:${durationSeconds}`;
}

// added full screen functionality
let isFull = false;
function fullScreenFunction() {
  if (fullScreen.textContent == "Full Screen" && isFull == false) {
    player.requestFullscreen();
    fullScreen.textContent = "Exit Full Screen";
    console.log(playerControls);
    isFull = true;
    // playerControls.style.transform = "translateY(100%) translateY(-5px)";
  } else if (fullScreen.textContent == "Exit Full Screen" && isFull == true) {
    document.exitFullscreen();
    fullScreen.textContent = "Full Screen";
    isFull = false;
    // playerControls.style.transform = "none";
    console.log(isFull);
  }
}

/////////////////////////////////////////
// hook up the event listeners
toggle.addEventListener("click", togglePlay);

video.addEventListener("play", updateButton);
video.addEventListener("pause", updateButton);
window.addEventListener("keydown", togglePlayKey);
video.addEventListener("click", togglePlay);
video.addEventListener("timeupdate", handleProgress);
video.addEventListener("timeupdate", currentTime);

skipButtons.forEach((button) => button.addEventListener("click", skip));

ranges.forEach((range) => range.addEventListener("change", handleRangeUpdate));

let mousedown = false;
progress.addEventListener("click", scrub);
//on mousemove, if mousedown is false, return out false and stop, if it's true, run the scrub function on the event (which is mousemove)
progress.addEventListener("mousemove", (e) => mousedown && scrub(e));
// upon clicking the mouse down, mousedown constant is true, so the above event listener will fire
progress.addEventListener("mousedown", () => (mousedown = true));
progress.addEventListener("mouseup", () => (mousedown = false));

fullScreen.addEventListener("click", fullScreenFunction);
