const sermons = document.getElementById('sermons');
const search = document.getElementById('search');

let allSermonsJSON = []

async function getSermons() {
    const request = await fetch('https://divinechristianassembly.com/api/dca_api/index.php/sermons');
    const response = await request.json();
    allSermonsJSON = response.data;
    filterSermons();
}

function filterSermons() {
    let allSermons = '';
    for (const sermon of allSermonsJSON) {
        if (sermon.title.toLowerCase().includes(search.value.toLowerCase())) {
            let sermonDate = new Date(sermon.date);
            let sermonDiv = `
            <div class='sermon'>
                <audio controls>
                <source src='${sermon.sermon}'>
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