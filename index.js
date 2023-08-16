// basic and general computation will be done here, this is linked to the index.html files
import "./utils/interaction.js";

const dimBackground = document.getElementById("dim-background");
const closePopupSermonBtn = document.getElementById("close-popup-sermon");
const popupSermonContainer = document.getElementById("popup-sermon-container");
const popupSermon = document.getElementById("popup-sermon");

const countdownDays = document.getElementById("countdown-days");
const countdownHours = document.getElementById("countdown-hours");
const countdownMins = document.getElementById("countdown-mins");
const countdownSecs = document.getElementById("countdown-secs");
const upcomingEventTitle = document.getElementById("upcoming-event-title");

const testimoniesContainer = document.getElementById("testimony-container");

const carouselImage = document.getElementById("carousel-slide");

// USABLE FUNCTIONS
function show(element, display = "block") {
  element.style.display = display;
}
function hide(element) {
  element.style.display = "none";
}

// sermons for pop up
// NOTE: you have to input embed link, not just link to youtube video
// @link https://support.google.com/youtube/answer/171780?hl=en
const ytSermons = [
  "https://www.youtube.com/embed/o_xpooNyPQ0",
  "https://www.youtube.com/embed/vssWH31MLb4",
  "https://www.youtube.com/embed/ILGSLAUfarQ",
  "https://www.youtube.com/embed/dRNLueXtxHI",
  "https://www.youtube.com/embed/9S8FD6jNkyw",
  "https://www.youtube.com/embed/RjnOU9z6flY",
  "https://www.youtube.com/embed/Sb1K5il-U-c",
  "https://www.youtube.com/embed/5ZWnu9UaUMY",
  "https://www.youtube.com/embed/HioujsHsdM8",

];
const randomSermon = ytSermons[Math.floor(Math.random() * 3)];

// show random sermon
popupSermon.src = "https://www.youtube.com/embed/vrdS5X_P5Ow";

// TODO: use session storage to note when popup has been shown and prevent it from showing up again for the session
// show sermon after 10s
let currentPosition;
const popupSermonTimer = setTimeout(() => {
  // document.body.style.overflow = 'hidden';
  currentPosition = window.scrollY;
  window.scrollTo(0, 0);
  show(dimBackground);
  show(popupSermonContainer);
  clearTimeout(popupSermonTimer);
}, 5500);

// close popup menu
closePopupSermonBtn.addEventListener("click", () => {
  hide(popupSermonContainer);
  hide(dimBackground);
  document.body.style.overflow = "scroll";
  // return user to position before sermon popped up
  window.scrollTo(0, currentPosition);
});

// hide popup when dim background is clicked
dimBackground.addEventListener("click", () => {
  closePopupSermonBtn.click();
});

setInterval(() => {
  carouselImage.style.backgroundImage = `url(./assets/images/carousel-slide-${randomFromRange(
    1,
    10
  )}.jpeg)`;
}, 3500);

function randomFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Get upcoming events data
(async function () {
  const response = await fetch("./json/upcomingEvent.json?v=132");
  const upcomingEvent = await response.json();

  // COUNTDOWN
  let date;
  const today = new Date();
  // check for next event date by comparing it to today's date.
  // If upcoming date is greater than today, then set upcomind event
  for (let event of upcomingEvent) {
    if (event && new Date(event.date) > today) {
      upcomingEventTitle.innerText = event.name;
      // const [yy, mm, dd] = event.date.split('-');
      // date = new Date(yy, mm - 1, dd);
      date = new Date(event.date);
      break;
    }
  }

  const oneDay = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds

  const countdown = setInterval(() => {
    if (date < today) return;

    let countDownDate = date.getTime();
    let now = new Date().getTime();

    var distance = countDownDate - now;

    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    var mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var secs = Math.floor((distance % (1000 * 60)) / 1000);

    // reset timer when days are over
    if (days < 0) {
      days = hours = mins = secs = 0;
      clearInterval(countdown);
    }

    countdownSecs.innerText = secs.toString().padStart(2, "0");
    countdownMins.innerText = mins.toString().padStart(2, "0");
    countdownHours.innerText = hours.toString().padStart(2, "0");
    countdownDays.innerText = days.toString().padStart(2, "0");
  }, 1000);
})();

// Get testimonies
(async function () {
  const response = await fetch("./json/testimonies.json");
  const testimoniesData = await response.json();
  testimoniesData.map(({ name, message }) => {
    testimoniesContainer.innerHTML += `
            <section class="testimony" id="testimony">
                <p class="testimony__msg">
                    ${message}
                </p>
                <p class="testimony__name"> — ${name}</p>
            </section>
        `;
  });
})();
