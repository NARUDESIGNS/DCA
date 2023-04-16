// basic and general computation will be done here, this is linked to the index.html files
import './utils/interaction.js';

const dimBackground = document.getElementById('dim-background');
const closePopupSermonBtn = document.getElementById('close-popup-sermon');
const popupSermonContainer = document.getElementById('popup-sermon-container');
const popupSermon = document.getElementById('popup-sermon');

const countdownDays = document.getElementById('countdown-days');
const countdownHours = document.getElementById('countdown-hours');
const countdownMins = document.getElementById('countdown-mins');
const countdownSecs = document.getElementById('countdown-secs');
const upcomingEventTitle = document.getElementById('upcoming-event-title');

const testimoniesContainer = document.getElementById('testimony-container');

const carouselImage = document.getElementById('carousel-slide');

// USABLE FUNCTIONS
function show(element, display = 'block') {
    element.style.display = display;
}
function hide(element) {
    element.style.display = 'none';
}

// sermons for pop up
// NOTE: you have to input embed link, not just link to youtube video 
// @link https://support.google.com/youtube/answer/171780?hl=en
const ytSermons = [
    "https://www.youtube.com/embed/atU4_NnjWBQ",
    "https://www.youtube.com/embed/BwvNfBIokRo",
    "https://www.youtube.com/embed/fLyLEPs4bWo",
    "https://www.youtube.com/embed/62lWbY6ECDw"
];
const randomSermon = ytSermons[Math.floor(Math.random() * 3)];

// show random sermon
popupSermon.src = randomSermon;

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
}, 7000);

// close popup menu
closePopupSermonBtn.addEventListener('click', () => {
    hide(popupSermonContainer);
    hide(dimBackground);
    document.body.style.overflow = 'scroll';
    // return user to position before sermon popped up
    window.scrollTo(0, currentPosition);
});


// hide popup when dim background is clicked
dimBackground.addEventListener('click', () => {
    closePopupSermonBtn.click();
});

setInterval(() => {
    carouselImage.style.backgroundImage = `url(./assets/images/carousel-slide-${randomFromRange(1, 3)}.jpeg)`;
}, 4500);

function randomFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}


// Get upcoming events data
(async function () {
    const response = await fetch('./json/upcomingEvent.json');
    const upcomingEvent = await response.json();

    // COUNTDOWN 
    let date;
    const today = new Date();
    // check for next event date by comparing it to today's date. 
    // If upcoming date is greater than today, then set upcomind event
    for (let event of upcomingEvent) {
        if (event && new Date(event.date) > today) {
            upcomingEventTitle.innerText = event.name;
            const [yy, mm, dd] = event.date.split('-');
            date = new Date(yy, mm - 1, dd);
            break;
        }
    }

    const oneDay = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds

    const countdown = setInterval(() => {
        if (date < today) return;
        const numOfDays = date > today ? Math.floor((date - today) / oneDay) : '00';
        let days = numOfDays;
        let hours = 23 >= new Date().getUTCHours() ? 23 - new Date().getUTCHours() : 0;
        let mins = 60 - new Date().getUTCMinutes();
        let secs = 60 - new Date().getUTCSeconds();

        // reset timer when days are over
        if (days < 0) {
            days = hours = mins = secs = 0;
            clearInterval(countdown);
        }

        countdownSecs.innerText = secs.toString().padStart(2, '0');
        countdownMins.innerText = mins.toString().padStart(2, '0');
        countdownHours.innerText = hours.toString().padStart(2, '0');
        countdownDays.innerText = days.toString().padStart(2, '0');
    }, 1000);
})();


// Get testimonies
(async function () {
    const response = await fetch('./json/testimonies.json');
    const testimoniesData = await response.json();
    testimoniesData.map(({name, message}) => {
        testimoniesContainer.innerHTML += `
            <section class="testimony" id="testimony">
                <p class="testimony__msg">
                    ${message}
                </p>
                <p class="testimony__name"> — ${name}</p>
            </section>
        `;
        console.log(name);
    });
})();