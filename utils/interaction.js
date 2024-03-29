// GET DOM ELEMENTS
const dimBackground = document.getElementById('dim-background');
const sideMenu = document.getElementById('side-menu');
const menuIcon = document.getElementById('menu-icon');
const noticesButton = document.querySelector('button.close-notices');

function setFooterDate() {
    const now = new Date();
    document.getElementById('footer-date').innerText = now.getFullYear();
}

setFooterDate();

// USABLE FUNCTIONS
function show(element, display = 'block') {
    element.style.display = display;
}
function hide(element) {
    element.style.display = 'none';
}

// State variables
let sideMenuIsOpen = false;


// Hide & Show side menu
menuIcon.addEventListener('click', () => {
    show(sideMenu, 'flex');
    sideMenu.classList.toggle('slide-in');
    sideMenu.classList.toggle('slide-out');
    if (!sideMenuIsOpen) {
        show(dimBackground, 'block');
        sideMenuIsOpen = true;
    } else {
        hide(dimBackground);
        sideMenuIsOpen = false;
    }
});

// Hide & Show notices
noticesButton.addEventListener('click', () => {
    document.querySelector('div.notices-modal').classList.add('hide-notices')
    setTimeout(function () {
        document.querySelector('div.notices-modal').remove()
    }, 4000);
});

