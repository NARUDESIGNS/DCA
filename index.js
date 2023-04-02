// basic and general computation will be done here, this is linked to the index.html files
import './utils/interaction.js';
import upcomingEvent from './json/upcomingEvent.json' assert {type: 'json'};

const dimBackground = document.getElementById('dim-background');
const closePopupSermonBtn = document.getElementById('close-popup-sermon');
const popupSermonContainer = document.getElementById('popup-sermon-container');
const popupSermon = document.getElementById('popup-sermon');

const countdownDays = document.getElementById('countdown-days');
const countdownHours = document.getElementById('countdown-hours');
const countdownMins = document.getElementById('countdown-mins');
const countdownSecs = document.getElementById('countdown-secs');
const upcomingEventTitle = document.getElementById('upcoming-event-title');

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
    "https://www.youtube.com/embed/RW1Y1TkEp5I",
    "https://www.youtube.com/embed/v0v5BJtZxrs",
    "https://www.youtube.com/embed/62lWbY6ECDw"
];
const randomSermon = ytSermons[Math.floor(Math.random() * 3)];

// show random sermon
popupSermon.src = randomSermon;

// TODO: use session storage to note when popup has been shown and prevent it from showing up again for the session
// show sermon after 10s
let currentPosition;
const popupSermonTimer = setTimeout(() => {
    document.body.style.overflow = 'hidden';
    currentPosition = window.scrollY;
    window.scrollTo(0,0);
    show(dimBackground);
    show(popupSermonContainer);
    clearTimeout(popupSermonTimer);
}, 10000);

// close popup menu
closePopupSermonBtn.addEventListener('click', () => {
    hide(popupSermonContainer);
    hide(dimBackground);
    document.body.style.overflow = 'scroll';
    // return user to position before sermon popped up
    window.scrollTo(0, currentPosition);
});


// hide popup when dim background is clicked
// dimBackground.addEventListener('click', () => {
//     closePopupSermonBtn.click();
// });


// COUNTDOWN 
let date;
const today = new Date();
// check for next event date by comparing it to today's date. 
// If upcoming date is greater than today, then set upcomind event
for (let event of upcomingEvent) {
    if (event && new Date(event.date) > today) {
        upcomingEventTitle.innerText = event.name;
        date = new Date(event.date);
        break;
    }
}
const oneDay = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds

const countdown = setInterval(() => {
    if (date < today) return;
    
    const numOfDays = date > today ? Math.floor((date - today)/oneDay) : '00';
    let days = numOfDays;
    let hours = 23 >= new Date().getHours() ? 23 - new Date().getHours() : 0;
    let mins = 60 - new Date().getMinutes();
    let secs = 60 - new Date().getSeconds();

    // reset timer when days are over
    if (!Number(days) || days < 0) {
        days = hours =  mins = secs = 0;
        clearInterval(countdown);
    }

    countdownSecs.innerText = secs.toString().padStart(2, '0');
    countdownMins.innerText = mins.toString().padStart(2, '0');
    countdownHours.innerText = hours.toString().padStart(2, '0');
    countdownDays.innerText = days.toString().padStart(2, '0');
}, 1000);