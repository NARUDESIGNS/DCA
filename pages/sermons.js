const sermons = document.getElementById('sermons');
const search = document.getElementById('search');

let searchThrottle;

let allSermonsJSON = []

async function getSermons() {
    const request = await fetch('https://divinechristianassembly.com/api/dca_api/index.php/sermons');
    const response = await request.json();
    allSermonsJSON = response.data;
    filterSermons();
}

function filterSermonsHandler() {
    clearTimeout(searchThrottle);
    searchThrottle = setTimeout(() => {
        filterSermons();
    }, 500);
}

function extractId(str) {
    const regex = /id=([^&]+)/;
    const match = str.match(regex);
    return match && match[1];
}

function generateAudioLink(str){
    return "https://drive.lienuc.com/uc?id=" + str;
}

function filterSermons() {
    let allSermons = '';
    for (const sermon of allSermonsJSON) {
        if (sermon.title.toLowerCase().includes(search.value.toLowerCase())) {
            let sermonDate = new Date(sermon.date);
            let sermonDiv = `
            <div class='sermon'>
                <audio crossorigin="anonymous" controls preload="none">
                    <source src='${generateAudioLink(extractId(sermon.sermon))}'>
                </audio>
                <p class='title'>${sermon.title}</p>
                <div class='sermon-row'>
                    <p class='preacher'>${sermon.preacher}</p>
                    <p class='date'>${sermonDate.toDateString()}</p>
                </div>
            </div>
            `;
            allSermons += sermonDiv;
        }
    }
    sermons.innerHTML = allSermons;
}

getSermons();