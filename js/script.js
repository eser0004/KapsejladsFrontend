// Base URL
const apiBaseUrl = "http://localhost:8080/api";

// DOM Elements
const sejlbaadeList = document.getElementById('sejlbaadeList');
const kapsejladsList = document.getElementById('kapsejladsList');
const deltagerList = document.getElementById('deltagereList');

// Toggle sections
document.getElementById('showSejlbaade').addEventListener('click', () => toggleSection('sejlbaadeSection'));

document.getElementById('showKapsejladser').addEventListener('click', () => {
    toggleSection('kapsejladserSection');
    fetchKapsejladser();
});

document.getElementById('showDeltagere').addEventListener('click', () => toggleSection('deltagereSection'));


function toggleSection(sectionId) {
    document.querySelectorAll('section').forEach(section => section.classList.add('hidden'));
    document.getElementById(sectionId).classList.remove('hidden');
}

// Fetch Sejlbåde
function fetchSejlbaade() {
    fetch(`${apiBaseUrl}/sejlbaade`)
        .then(response => response.json())
        .then(data => {
            sejlbaadeList.innerHTML = '';
            data.forEach(boat => {
                const li = document.createElement('li');
                li.textContent = `ID: ${boat.id}, Navn: ${boat.navn}, Type: ${boat.baadType}`;
                sejlbaadeList.appendChild(li);
            });
        });
}
function formatBaadType(baadType) {
    switch (baadType) {
        case "MINDRE_END_25FOD": return "Mindre end 25 fod";
        case "MELLEM_25_40FOD": return "Mellem 25-40 fod";
        case "LAANGERE_END_40FOD": return "Længere end 40 fod";
        default: return "Ukendt type";
    }
}

// Fetch Kapsejladser
function fetchKapsejladser() {
    fetch(`${apiBaseUrl}/kapsejladser`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Fejl ved hentning af kapsejladser");
            }
            return response.json();
        })
        .then(data => {
            console.log("Kapsejladser hentet fra backend:", data); // Debugging
            const kapsejladsList = document.getElementById('kapsejladserList');
            kapsejladsList.innerHTML = ''; // Ryd tidligere indhold

            // Iterer gennem kapsejladserne og vis dem
            data.forEach(kapsejlads => {
                const kapsejladsDiv = document.createElement('div');
                kapsejladsDiv.classList.add('kapsejlads-item'); // Tilføj styling
                kapsejladsDiv.innerHTML = `
                    <p><strong>ID:</strong> ${kapsejlads.id}</p>
                    <p><strong>Dato:</strong> ${kapsejlads.dato}</p>
                    <p><strong>Bådtype:</strong> ${formatBaadType(kapsejlads.baadType)}</p>
                    <p><strong>Startende Både:</strong> ${kapsejlads.antalStartendeBaade}</p>
                `;
                kapsejladsList.appendChild(kapsejladsDiv);
            });
        })
        .catch(error => console.error("Fejl ved hentning af kapsejladser:", error));
}




// Fetch Deltagere
function fetchDeltagere() {
    fetch(`${apiBaseUrl}/deltagere`)
        .then(response => response.json())
        .then(data => {
            deltagerList.innerHTML = '';
            data.forEach(participant => {
                const li = document.createElement('li');
                li.textContent = `ID: ${participant.id}, Kapsejlads: ${participant.kapsejlads.dato}, Sejlbåd: ${participant.sejlbaad.navn}, Point: ${participant.point}`;
                deltagerList.appendChild(li);
            });
        });
}

// Initial Fetch
fetchSejlbaade();
fetchKapsejladser();
fetchDeltagere();


document.getElementById('createKapsejladsForm').addEventListener('submit', e => {
    e.preventDefault();

    const dato = document.getElementById('kapsejladsDato').value;
    const baadType = document.getElementById('kapsejladsBaadType').value;
    const antalStartendeBaade = parseInt(document.getElementById('antalStartendeBaade').value);

    fetch(`${apiBaseUrl}/kapsejladser`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dato, baadType, antalStartendeBaade }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Fejl ved oprettelse af kapsejlads");
            }
            return response.json();
        })
        .then(() => fetchKapsejladser())
        .catch(error => console.error("Fejl:", error));
});


document.getElementById('createKapsejladsForm').addEventListener('submit', e => {
    e.preventDefault();
    const dato = document.getElementById('kapsejladsDato').value;
    const baadType = document.getElementById('kapsejladsBaadType').value;
    const antalStartendeBaade = parseInt(document.getElementById('antalStartendeBaade').value);

    fetch(`${apiBaseUrl}/kapsejladser`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dato, baadType, antalStartendeBaade }),
    })
        .then(() => fetchKapsejladser())
        .catch(error => console.error("Fejl ved oprettelse af kapsejlads:", error));
});

document.getElementById('createDeltagerForm').addEventListener('submit', e => {
    e.preventDefault();
    const kapsejladsId = parseInt(document.getElementById('kapsejladsId').value);
    const sejlbaadId = parseInt(document.getElementById('sejlbaadId').value);
    const point = parseInt(document.getElementById('point').value);

    fetch(`${apiBaseUrl}/deltagere`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kapsejladsId, sejlbaadId, point }),
    })
        .then(() => fetchDeltagere())
        .catch(error => console.error("Fejl ved oprettelse af deltager:", error));
});

// Update Functions
function editSejlbaad(id, currentName, currentType) {
    const newName = prompt("Indtast nyt navn:", currentName);
    const newType = prompt("Indtast ny type (MINDRE_END_25FOD, MELLEM_25_40FOD, LAANGERE_END_40FOD):", currentType);

    if (newName && newType) {
        fetch(`${apiBaseUrl}/sejlbaade/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ navn: newName, baadType: newType }),
        })
            .then(() => fetchSejlbaade())
            .catch(error => console.error("Fejl ved opdatering af sejlbåd:", error));
    }
}

function updateParticipant(id) {
    const newPoints = prompt("Indtast nye point:");
    if (newPoints) {
        fetch(`${apiBaseUrl}/deltagere/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ point: parseInt(newPoints) }),
        })
            .then(() => fetchDeltagere())
            .catch(error => console.error("Fejl ved opdatering af deltager:", error));
    }
}

// Delete Functions
function deleteSejlbaad(id) {
    fetch(`${apiBaseUrl}/sejlbaade/${id}`, { method: 'DELETE' })
        .then(() => fetchSejlbaade())
        .catch(error => console.error("Fejl ved sletning af sejlbåd:", error));
}

function deleteParticipant(id) {
    fetch(`${apiBaseUrl}/deltagere/${id}`, { method: 'DELETE' })
        .then(() => fetchDeltagere())
        .catch(error => console.error("Fejl ved sletning af deltager:", error));
}

// Helpers
function formatBaadType(baadType) {
    switch (baadType) {
        case "MINDRE_END_25FOD": return "Mindre end 25 fod";
        case "MELLEM_25_40FOD": return "Mellem 25-40 fod";
        case "LAANGERE_END_40FOD": return "Længere end 40 fod";
        default: return "Ukendt type";
    }
}

