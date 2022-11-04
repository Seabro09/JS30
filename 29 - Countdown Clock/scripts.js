// global variable for f
let countdown;
const timerDisplay = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');
// seleft all buttons with a data-time attribute (I believe this is a custom attribute he set)
const buttons = document.querySelectorAll('[data-time]');

function timer(seconds) {
  // clear any existing timers
  clearInterval(countdown);
  // Date.now() will give us the current timestamp in milliseconds
  const now = Date.now();
  // what you want the timer to go to (seconds being our parameter)
  const then = now + seconds * 1000;
  // display the seconds immediately once
  displayTimeLeft(seconds);
  displayEndTime(then);
  // every second, we need to display the amount of time leftf, we will use an interval
  // we want how many seconds we have left, well we do then minus the current timestamp and divide by 1000 to get the milliseconds again
  countdown = setInterval(() => {
    // we want how many seconds we have left, well we do then minus the current timestamp and divide by 1000 to get the milliseconds again
    const secondsLeft = Math.round((then - Date.now()) / 1000);
    // check if we should stop it
    if (secondsLeft <= 0) {
      clearInterval(countdown);
      return;
    }
    // display it everytime starting after 1 second (the interval is the one second)
    displayTimeLeft(secondsLeft);
  }, 1000);
}

function displayTimeLeft(seconds) {
  console.log(seconds);
  // minutes will be the rounded version of how many seconds we are passing divided by 60
  const minutes = Math.floor(seconds / 60);
  // the remainder is what ever is left as a remainder when dividing seconds by 60 (seconds mod 60)
  const remainderSeconds = seconds % 60;
  // to add our 0 in front of our single digit seconds we say:
  // if remainder of seconds is less than 10, give a 0 in front of remainderSeconds, else, just put nothing in front.
  // This is a ternary operator
  const display = `${minutes}:${
    remainderSeconds < 10 ? '0' : ''
  }${remainderSeconds}`;
  document.title = display;
  // timerDisplay is our div
  timerDisplay.textContent = display;
}

function displayEndTime(timestamp) {
  // format the timestamp
  const end = new Date(timestamp);
  // pull the hours out of that
  const hour = end.getHours();
  // pull the minutes out
  const minutes = end.getMinutes();
  const adjustedHour = hour > 12 ? hour - 12 : hour;
  endTime.textContent = `Be back at ${adjustedHour}:${
    minutes < 10 ? '0' : ''
  }${minutes}`;
}
function startTimer() {
  const seconds = parseInt(this.dataset.time);
  timer(seconds);
}

buttons.forEach((button) => button.addEventListener('click', startTimer));
document.customForm.addEventListener('submit', function (e) {
  // stops browser from performing a GET
  e.preventDefault();
  const mins = this.minutes.value;
  timer(mins * 60);
  this.reset();
});
