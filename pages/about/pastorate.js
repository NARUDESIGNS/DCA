// GET DOM ELEMENTS
const dimBackground = document.getElementById('dim-background');
const sideMenu = document.getElementById('side-menu');
const menuIcon = document.getElementById('menu-icon');

const bioCredentials = document.getElementsByClassName('pastors-credentials__bio');
const bioContainer = document.getElementById('bio-container');
const bioRole = document.getElementById('bio-role');
const bioDesc = document.getElementById('bio-desc');
const closeBio = document.getElementById('close-bio');

const noticesButton = document.querySelector('button.close-notices');

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

// Hide menu when dim background is clicked
dimBackground.addEventListener('click', () => {
    if (sideMenu.classList.contains('slide-in')) menuIcon.click();
});

closeBio.addEventListener('click', () => {
    bioContainer.classList.toggle('fade-in');
    bioContainer.classList.toggle('fade-out');
    hide(dimBackground);
    hide(bioContainer);
    document.body.style.overflow = 'scroll';
});

(async function () {
    const response = await fetch('../../json/pastorate.json');
    const pastors = await response.json();

    // BIO MODAL
    for (let details of bioCredentials) {
        details.addEventListener('click', (e) => {
            const role = e.target.parentElement.firstElementChild.innerText;
            const name = e.target.previousElementSibling.innerText;
            const details = pastors[name];
            bioRole.innerText = role;
            bioDesc.innerText = details;

            document.body.style.overflow = 'hidden';
            show(dimBackground);
            show(bioContainer, 'flex');
        });
    }
})();

// Hide & Show notices
noticesButton.addEventListener('click', () => {
    document.querySelector('div.notices-modal').classList.add('hide-notices')
    setTimeout(function () {
        document.querySelector('div.notices-modal').remove()
    }, 4000);
});

