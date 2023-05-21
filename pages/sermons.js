async function getSermons() {
    const request = await fetch('https://divinechristianassembly.com/api/dca_api/index.php/sermons');
    const response = await request.json();
    let allSermons = '';
    for (const sermon of response.data) {
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
    const sermons = document.getElementById('sermons');
    console.log(sermons);
    sermons.innerHTML = allSermons;


}

getSermons();