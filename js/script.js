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
document.getElementById('generateAllKapsejladser').addEventListener('click', () => {
    fetch(`${apiBaseUrl}/kapsejladser/generate`, { method: 'POST' })
        .then(response => {
            if (!response.ok) {
                throw new Error("Fejl ved oprettelse af alle kapsejladser");
            }
            return response.text();
        })
        .then(message => {
            alert(message); // Vis besked
            fetchKapsejladser(); // Opdater listen
        })
        .catch(error => console.error("Fejl ved oprettelse af alle kapsejladser:", error));
});
document.getElementById('deleteAllKapsejladser').addEventListener('click', () => {
    if (confirm("Er du sikker på, at du vil slette alle kapsejladser?")) {
        fetch(`${apiBaseUrl}/kapsejladser/deleteAll`, { method: 'DELETE' })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Fejl ved sletning af alle kapsejladser");
                }
                return response.text();
            })
            .then(message => {
                alert(message); // Vis besked
                fetchKapsejladser(); // Opdater listen
            })
            .catch(error => console.error("Fejl ved sletning af alle kapsejladser:", error));
    }
});

document.getElementById('deleteAllData').addEventListener('click', () => {
    if (confirm("Er du sikker på, at du vil slette alle data? Dette vil også nulstille ID'er!")) {
        fetch(`${apiBaseUrl}/kapsejladser/deleteAllData`, { method: 'DELETE' })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Fejl ved sletning af alle data");
                }
                return response.text();
            })
            .then(message => {
                alert(message);
                fetchSejlbaade(); // Opdater listen over sejlbåde
                fetchKapsejladser(); // Opdater listen over kapsejladser
                fetchParticipants(); // Opdater listen over deltagere
            })
            .catch(error => console.error("Fejl ved sletning af alle data:", error));
    }
});
document.getElementById('generateSejlbaadeButton').addEventListener('click', () => {
    const antal = prompt("Hvor mange sejlbåde vil du generere?");
    if (antal && !isNaN(antal) && parseInt(antal) > 0) {
        fetch(`${apiBaseUrl}/sejlbaade/generate?antal=${antal}`, { method: 'POST' })
            .then(response => response.text())
            .then(message => {
                alert(message);
                fetchSejlbaade(); // Opdater listen over sejlbåde
            })
            .catch(error => console.error("Fejl ved generering af sejlbåde:", error));
    } else {
        alert("Indtast et gyldigt antal sejlbåde.");
    }
});
document.getElementById('generateDeltagereButton').addEventListener('click', () => {
    const antal = prompt("Hvor mange deltagere vil du generere?");
    if (antal && !isNaN(antal) && parseInt(antal) > 0) {
        fetch(`${apiBaseUrl}/deltagere/generate?antal=${antal}`, { method: 'POST' })
            .then(response => response.text())
            .then(message => {
                alert(message);
                fetchParticipants(); // Opdater listen over deltagere
            })
            .catch(error => console.error("Fejl ved generering af deltagere:", error));
    } else {
        alert("Indtast et gyldigt antal deltagere.");
    }
});

// Opret Deltager
document.getElementById('createDeltagerForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const kapsejladsId = document.getElementById('kapsejladsId').value;
    const sejlbaadId = document.getElementById('sejlbaadId').value;
    const point = document.getElementById('point').value;

    fetch(`${apiBaseUrl}/deltagere`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kapsejladsId, sejlbaadId, point }),
    })
        .then(response => response.text())
        .then(message => {
            alert(message);
            fetchParticipants(); // Opdater listen
        })
        .catch(error => console.error("Fejl ved oprettelse af deltager:", error));
});

// Generer Deltagere
document.getElementById('generateDeltagereButton').addEventListener('click', () => {
    const antal = prompt("Hvor mange deltagere vil du generere?");
    if (antal && !isNaN(antal) && parseInt(antal) > 0) {
        fetch(`${apiBaseUrl}/deltagere/generate?antal=${antal}`, { method: 'POST' })
            .then(response => response.text())
            .then(message => {
                alert(message); // Vis besked fra backend
                fetchParticipants(); // Opdater listen
            })
            .catch(error => console.error("Fejl ved generering af deltagere:", error));
    } else {
        alert("Indtast et gyldigt antal deltagere.");
    }
});


// Slet Alle Deltagere
document.getElementById('deleteAllDeltagereButton').addEventListener('click', () => {
    if (confirm("Er du sikker på, at du vil slette alle deltagere?")) {
        fetch(`${apiBaseUrl}/deltagere`, { method: 'DELETE' })
            .then(response => response.text())
            .then(message => {
                alert(message);
                fetchParticipants(); // Opdater listen
            })
            .catch(error => console.error("Fejl ved sletning af deltagere:", error));
    }
});

// Hent Deltagere
function fetchParticipants() {
    fetch(`${apiBaseUrl}/deltagere`)
        .then(response => response.json())
        .then(data => {
            const deltagerList = document.getElementById('deltagereList');
            deltagerList.innerHTML = ''; // Ryd tidligere indhold

            if (data.length === 0) {
                deltagerList.innerHTML = "<li>Ingen deltagere fundet.</li>";
                return;
            }

            data.forEach(deltager => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <p><strong>ID:</strong> ${deltager.id}</p>
                    <p><strong>Kapsejlads:</strong> ${deltager.kapsejlads.dato} (${deltager.kapsejlads.baadType})</p>
                    <p><strong>Sejlbåd:</strong> ${deltager.sejlbaad.navn}</p>
                    <p><strong>Point:</strong> ${deltager.point}</p>
                `;
                deltagerList.appendChild(li);
            });
        })
        .catch(error => console.error("Fejl ved hentning af deltagere:", error));
}

// Initial Hentning af Deltagere
fetchParticipants();


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




function fetchMostActiveSejlbaade() {
    fetch(`${apiBaseUrl}/deltagere/most-active`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Fejl ved hentning af mest aktive sejlbåde");
            }
            return response.json();
        })
        .then(data => {
            const mostActiveSejlbaadeList = document.getElementById('mostActiveSejlbaadeList');
            mostActiveSejlbaadeList.innerHTML = ''; // Ryd tidligere indhold

            if (data.length === 0) {
                mostActiveSejlbaadeList.innerHTML = "<p>Ingen sejlbåde har deltaget endnu.</p>";
                return;
            }

            data.forEach(item => {
                const div = document.createElement('div');
                div.classList.add('sejlbaad-item'); // Tilføj styling
                div.innerHTML = `
                    <p><strong>Navn:</strong> ${item.navn}</p>
                    <p><strong>Antal Deltagelser:</strong> ${item.antalDeltagelser}</p>
                `;
                mostActiveSejlbaadeList.appendChild(div);
            });
        })
        .catch(error => console.error("Fejl ved hentning af mest aktive sejlbåde:", error));
}

// Tilføj knap for at hente mest aktive sejlbåde
document.getElementById('showMostActiveSejlbaade').addEventListener('click', () => {
    toggleSection('mostActiveSejlbaadeSection');
    fetchMostActiveSejlbaade();
});


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

