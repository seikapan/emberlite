document.getElementById('fetchStats').addEventListener('click', async () => {
    const playerName = document.getElementById('playerName').value;
    const response = await fetch(`/api/stats/${playerName}`);
    const data = await response.json();

    if (data.error) {
        document.getElementById('output').innerText = `Error: ${data.error}`;
    } else {
        const { analysis } = data;
        document.getElementById('output').innerHTML = `
            <p>FKDR: ${analysis.fkdr}</p>
            <p>Games to Next Prestige: ${analysis.gamesToNextPrestige}</p>
        `;
    }
});
