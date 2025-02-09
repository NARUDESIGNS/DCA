// basic and general computation will be done here, this is linked to the index.html files
import "./utils/interaction.js";

const head = document.querySelector('head');
head.innerHTML += `
<script async src="https://www.googletagmanager.com/gtag/js?id=G-SGFNLCDVYM"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag() {
        dataLayer.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', 'G-SGFNLCDVYM'); 
</script>
`;

const dimBackground = document.getElementById("dim-background");
const closePopupSermonBtn = document.getElementById("close-popup-sermon");
const popupSermonContainer = document.getElementById("popup-sermon-container");
const popupSermon = document.getElementById("popup-sermon");

const closePopupImgBtn = document.getElementById("close-popup-img");
const popupImgContainer = document.getElementById("popup-img-container");
const popupImg = document.getElementById("popup-img");

const countdownDays = document.getElementById("countdown-days");
const countdownHours = document.getElementById("countdown-hours");
const countdownMins = document.getElementById("countdown-mins");
const countdownSecs = document.getElementById("countdown-secs");
const upcomingEventTitle = document.getElementById("upcoming-event-title");

const testimoniesContainer = document.getElementById("testimony-container");

const carouselImage = document.getElementById("carousel-slide");


const bannerImage = document.getElementById('banner-wrapper');
const closeBannerImage = document.getElementById('close-banner-wrapper');

const body = document.querySelector('body');

setTimeout(function () {
  body.style.overflow = 'hidden';
  bannerImage.style.animation = '1.75s scroll-down forwards linear';
}, 3200);

closeBannerImage.addEventListener('click', function () {
  bannerImage.style.animation = '1.75s scroll-up forwards linear';
  body.style.overflow = 'scroll';

  popupSermonTimer = setTimeout(async () => {

    const request = await fetch('https://divinechristianassembly.com/api/dca/index.php/users/streamlink');
    const response = await request.json();
    try {
      popupSermon.src = response.data.link;
    } catch (e) {
      popupSermon.src = "https://www.youtube.com/embed/FsWE6JiUeYk";
    }

    currentPosition = window.scrollY;
    window.scrollTo(0, 0);
    show(dimBackground);
    show(popupSermonContainer);
    clearTimeout(popupSermonTimer);
  }, 5500);
});


// USABLE FUNCTIONS
function show(element, display = "block") {
  element.style.display = display;
}
function hide(element, deleteElement) {
  element.style.display = "none";
  if (deleteElement) {
    element.innerHTML = '';
  }
}

// sermons for pop up
// NOTE: you have to input embed link, not just link to youtube video
// @link https://support.google.com/youtube/answer/171780?hl=en

// show random sermon

// TODO: use session storage to note when popup has been shown and prevent it from showing up again for the session
// show sermon after 10s
let currentPosition;
let popupSermonTimer = null;

// const popupImgTimer = setTimeout(async () => {
//   currentPosition = window.scrollY;
//   window.scrollTo(0, 0);
//   show(dimBackground);
//   show(popupImgContainer);
//   clearTimeout(popupImgTimer);
// }, 6500);

// close popup menu
closePopupSermonBtn.addEventListener("click", () => {
  hide(popupSermonContainer, true);
  hide(dimBackground);
  document.body.style.overflow = "scroll";
  // return user to position before sermon popped up
  window.scrollTo(0, currentPosition);
});


// close popup img
closePopupImgBtn.addEventListener("click", () => {
  hide(popupImgContainer, true);
  hide(dimBackground);
  document.body.style.overflow = "scroll";
  // return user to position before sermon popped up
  window.scrollTo(0, currentPosition);
});


// hide popup when dim background is clicked
dimBackground.addEventListener("click", () => {
  closePopupSermonBtn.click();
});

let isFrequent = true

setInterval(() => {
  if (isFrequent) {
    carouselImage.style.backgroundImage = `url(./assets/images/new-carousel/image_${randomFromRange(
      [0, 2, 28, 30, 32, 38, 54, 54, 56, 58, 60, 62, 64, 66, 68, 70, 72, 71, 73, 65, 67, 74, 76, 78, 80, 82, 84, 86, 88, 90]
    )}.jpeg)`;
  } else {
    carouselImage.style.backgroundImage = `url(./assets/images/new-carousel/frequent/frequent_${Math.floor(Math.random() * 14) + 1}.jpeg)`;
  }
  isFrequent = !isFrequent;
}, 3500);

const pastorsImage = document.querySelector('.resident-pastor-img')

setInterval(() => {
  pastorsImage.style.backgroundImage = `url(./assets/images/pastors${randomFromRange(
    [1, 2, 3, 4]
  )}.jpeg)`;
}, 3500);

function randomFromRange(available) {
  return available[Math.floor(Math.random() * available.length)];
}


function getNextDefaultEvent() {
  // Get the current date
  const currentDate = new Date();

  // Calculate the number of days until the next Wednesday (3) or Sunday (0)
  const daysUntilWednesday = (3 - currentDate.getDay() + 7) % 7;
  const daysUntilSunday = (0 - currentDate.getDay() + 7) % 7;

  // Calculate the dates of the next Wednesday and Sunday
  const nextWednesday = new Date(currentDate);
  nextWednesday.setDate(currentDate.getDate() + daysUntilWednesday);
  nextWednesday.setHours(18);

  const nextSunday = new Date(currentDate);
  nextSunday.setDate(currentDate.getDate() + daysUntilSunday);
  nextSunday.setHours(9);

  if (nextWednesday < nextSunday) {
    return { date: nextWednesday, title: 'Mid Week Service' };
  }

  return { date: nextSunday, title: 'Sunday Service' };
}


// Get upcoming events data
(async function () {
  const response = await fetch("./json/upcomingEvent.json");
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

  if (!date) {
    const nextEventDetails = getNextDefaultEvent();
    upcomingEventTitle.innerText = nextEventDetails.title;
    date = nextEventDetails.date;
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
