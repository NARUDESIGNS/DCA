let selectedWorker = '';

let selectedDept = '';

const workerNominees = [
    {
        'fullName': 'Bro. Emmanuel Oke',
        'department': 'Apocalypse (Drama)',
    },
    {
        'fullName': 'Sis. Bola Ejigbo',
        'department': 'Children Department',
    },
    {
        'fullName': 'Bro. Oluwatobi Olusegun',
        'department': 'Ushering Department',
    },
    {
        'fullName': 'Pst. Ogaga Eroubome',
        'department': 'Choir Department',
    },
    {
        'fullName': 'Dcn. Oluwafunmilayo Ojo',
        'department': 'Technical & Multimedia',
    },
    {
        'fullName': 'Bro. Solomon Princewill',
        'department': 'Security Department',
    },
    {
        'fullName': 'Bro. David Aranmonise',
        'department': 'Protocol Department',
    },
];

const departments = [
    'Apocalypse (Drama)',
    'Cell Fellowship',
    'Children Department',
    'Choir',
    'Follow Up',
    'Learning at His Feet',
    'Protocol',
    'Sanctuary Keepers',
    'Security',
    'Technical & Multimedia',
    'Ushering',
];

function selectWorker(index) {
    const nominees = document.querySelectorAll('.workers .nominee');
    nominees.forEach((nominee) => {
        nominee.classList.remove('selected');
    });
    nominees[index].classList.add('selected');
    selectedWorker = workerNominees[index];
    selectedWorker.index = index;
    document.querySelector('div.workers.selection').innerHTML = `
            <h3>Worker of the Year</h3>
            <div class="nominee selected">
                <img src="/assets/images/workers/${index + 1}.png" alt="">
                <p>${selectedWorker.fullName}</p>
                <span>${selectedWorker.department}</span>
            </div>
            `;
}

function selectDept(index) {
    const nominees = document.querySelectorAll('.departments .nominee');
    nominees.forEach((nominee) => {
        nominee.classList.remove('selected');
    });
    nominees[index].classList.add('selected');
    selectedDept = departments[index];
    document.querySelector('div.departments.selection').innerHTML = `
            <h3>Department of the Year</h3>
            <div class="nominee selected">
                <p>${selectedDept}</p>
            </div>
            `;
}

function renderWorkers() {
    const workersDiv = document.querySelector('div.workers');
    workersDiv.innerHTML = '';
    workerNominees.forEach((worker, index) => {
        workersDiv.innerHTML += `
                <div class="nominee" onclick="selectWorker(${index})">
                    <img src="/assets/images/workers/${index + 1}.png" alt="">
                    <p>${worker.fullName}</p>
                    <span>${worker.department}</span>
                </div>
                `;
    });
}

function renderDepartments() {
    const departmentsDiv = document.querySelector('div.departments');
    departmentsDiv.innerHTML = '';
    departments.forEach((department, index) => {
        departmentsDiv.innerHTML += `
                <div class="nominee" onclick="selectDept(${index})">
                    <p>${department}</p>
                </div>
                `;
    });
}

function initialRender() {
    let votingDetails = localStorage.getItem('jan-2023-voting');
    if (votingDetails) {
        document.querySelectorAll('div.ballots').forEach((div) => {
            div.style.display = 'none';
        });
        document.querySelector('button.btn').style.display = 'none';
        document.querySelector('button.loading-btn').style.display = 'none';
        votingDetails = JSON.parse(votingDetails);
        document.querySelector('div.workers.selection').innerHTML = `
            <h3>Your Worker of the Year</h3>
            <div class="nominee selected">
                <img src="/assets/images/workers/${votingDetails.worker.index + 1}.png" alt="">
                <p>${votingDetails.worker.fullName}</p>
                <span>${votingDetails.worker.department}</span>
            </div>
            `;
        document.querySelector('div.departments.selection').innerHTML = `
        <h3>Your Department of the Year</h3>
        <div class="nominee selected">
            <p>${votingDetails.department}</p>
        </div>
        `;

    } else {
        renderWorkers();
        renderDepartments();
    }
}

initialRender();

async function castVote() {
    if (selectedWorker === '') {
        showSnackbar('Select a worker of the year');
        return;
    } else if (selectedDept === '') {
        showSnackbar('Select a department of the year');
        return;
    } else {
        document.querySelector('button.btn').style.display = 'none';
        document.querySelector('button.loading-btn').style.display = 'block';

        try {
            const request = await fetch('https://divinechristianassembly.com/api/dca/index.php/users/vote', {
                method: 'POST',
                body: JSON.stringify({
                    worker: selectedWorker.fullName,
                    department: selectedDept,
                })
            });
            const response = await request.json();
            if (response.error) {
                showSnackbar(response.message);
                document.querySelector('button.btn').style.display = 'block';
                document.querySelector('button.loading-btn').style.display = 'none';
            } else {
                showSnackbar('Your vote has been cast');
                const votingDetails = {
                    worker: selectedWorker,
                    department: selectedDept,
                }
                localStorage.setItem('jan-2023-voting', JSON.stringify(votingDetails));
                initialRender();
            }
        } catch (error) {
            showSnackbar('An error occurred');
            document.querySelector('button.btn').style.display = 'block';
            document.querySelector('button.loading-btn').style.display = 'none';
        }

    }
}

