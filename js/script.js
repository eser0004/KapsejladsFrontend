const apiUrl = "http://localhost:8080/api/sejlbaade";

function fetchSejlbaade() {
    fetch("http://localhost:8080/api/sejlbaade")
        .then(response => {
            if (!response.ok) {
                throw new Error("Fejl ved hentning af sejlbåde");
            }
            return response.json();
        })
        .then(data => {
            const container = document.getElementById('boats-container');
            container.innerHTML = ''; // Ryd tidligere indhold
            data.forEach(boat => {
                const div = document.createElement('div');
                div.innerHTML = `
                    <div style="flex: 1; display: flex; align-items: center;">
                        <strong>${boat.navn}</strong>
                        <span style="margin-left: 10px;">(${formatBaadType(boat.baadType)})</span>
                    </div>
                    <div>
                        <button onclick="editSejlbaad(${boat.id}, '${boat.navn}', '${boat.baadType}')">Rediger</button>
                        <button onclick="deleteSejlbaad(${boat.id})">Slet</button>
                    </div>
                `;
                container.appendChild(div);
            });
        })
        .catch(error => console.error("Fejl ved hentning af både:", error));
}

document.addEventListener('DOMContentLoaded', () => {
    fetchSejlbaade(); // Henter alle både fra backend, når siden indlæses
});



function createSejlbaad() {
    const name = document.getElementById('name').value;
    const type = document.getElementById('type').value;

    fetch("http://localhost:8080/api/sejlbaade", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ navn: name, baadType: type }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Fejl ved oprettelse af sejlbåd");
            }
            return response.json();
        })
        .then(data => {
            console.log("Sejlbåd oprettet:", data);
            fetchSejlbaade(); // Genindlæs listen
        })
        .catch(error => console.error("Fejl:", error));




}
function editSejlbaad(id, currentName, currentType) {
    const container = document.getElementById('boats-container');
    const editForm = document.createElement('div');
    editForm.innerHTML = `
        <input type="text" id="edit-name-${id}" value="${currentName}" />
        <select id="edit-type-${id}">
            <option value="MINDRE_END_25FOD" ${currentType === "MINDRE_END_25FOD" ? "selected" : ""}>Mindre end 25 fod</option>
            <option value="MELLEM_25_40FOD" ${currentType === "MELLEM_25_40FOD" ? "selected" : ""}>Mellem 25-40 fod</option>
            <option value="LAANGERE_END_40FOD" ${currentType === "LAANGERE_END_40FOD" ? "selected" : ""}>Længere end 40 fod</option>
        </select>
        <button onclick="updateSejlbaad(${id})">Gem</button>
        <button onclick="fetchSejlbaade()">Annuller</button>
    `;
    container.innerHTML = ''; // Tøm containeren for at vise redigeringsformularen
    container.appendChild(editForm);
}
function updateSejlbaad(id) {
    const name = document.getElementById(`edit-name-${id}`).value;
    const type = document.getElementById(`edit-type-${id}`).value;

    fetch(`http://localhost:8080/api/sejlbaade/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ navn: name, baadType: type }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Fejl ved opdatering af sejlbåd");
            }
            return response.json();
        })
        .then(() => {
            fetchSejlbaade(); // Genindlæs listen
        })
        .catch(error => console.error("Fejl:", error));
}

div.innerHTML = `
    <strong>${boat.navn}</strong>
    <span>${formatBaadType(boat.baadType)}</span>
    <div>
        <button onclick="editSejlbaad(${boat.id}, '${boat.navn}', '${boat.baadType}')">Rediger</button>
        <button onclick="deleteSejlbaad(${boat.id})">Slet</button>
    </div>
`;

function formatBaadType(baadType) {
    switch (baadType) {
        case "MINDRE_END_25FOD":
            return "Mindre end 25 fod";
        case "MELLEM_25_40FOD":
            return "Mellem 25-40 fod";
        case "LAANGERE_END_40FOD":
            return "Længere end 40 fod";
        default:
            return "Ukendt type"; // Håndter ukendte typer
    }
}

function deleteSejlbaad(id) {
    fetch(`${apiUrl}/${id}`, { method: 'DELETE' }).then(() => {
        fetchSejlbaade();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    fetchSejlbaade();
});

document.addEventListener('DOMContentLoaded', fetchSejlbaade);
const raceApiUrl = "http://localhost:8080/api/kapsejladser";

function fetchRaces() {
    fetch(raceApiUrl)
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('race-container');
            container.innerHTML = '';
            data.forEach(race => {
                const div = document.createElement('div');
                div.innerHTML = `
                    <strong>${race.dato}</strong> - ${race.baadType}
                    <p>Antal startende både: ${race.antalStartendeBaade}</p>
                `;
                container.appendChild(div);
            });
        })
        .catch(error => console.error("Fejl ved hentning af kapsejladser:", error));
}

function generateKapsejladser() {
    fetch(`${raceApiUrl}/generate`, { method: 'POST' })
        .then(response => response.json())
        .then(() => fetchRaces())
        .catch(error => console.error("Fejl ved generering af kapsejladser:", error));
}

// Hent kapsejladser, når siden indlæses
document.addEventListener('DOMContentLoaded', () => {
    fetchRaces();
});
