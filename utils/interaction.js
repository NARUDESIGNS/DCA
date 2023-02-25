// GET DOM ELEMENTS
const dimBackground = document.getElementById('dim-background');
const sideMenu = document.getElementById('side-menu');
const menuIcon = document.getElementById('menu-icon');


// USABLE FUNCTIONS
function show(element, display) {
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