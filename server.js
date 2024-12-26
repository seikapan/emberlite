const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
const PORT = 3000;

function calculateFKDR(stats) {
    const finalKills = stats.achievements.bedwars_final_kills || 0;
    const finalDeaths = stats.achievements.bedwars_final_deaths || 1;
    return (finalKills / finalDeaths).toFixed(2);
}

function estimateNextPrestige(stats) {
    const xp = stats.achievements.bedwars_experience || 0;
    const xpPerGame = stats.stats.Bedwars.bedwars_xp_per_game || 500;
    const xpToNextPrestige = (Math.floor(xp / 5000) + 1) * 5000 - xp;
    return Math.ceil(xpToNextPrestige / xpPerGame);
}

app.get('/api/stats/:player', async (req, res) => {
    const playerName = req.params.player;
    const apiKey = process.env.HYPIXEL_API_KEY;
    const url = `https://api.hypixel.net/player?key=${apiKey}&name=${playerName}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!data.success) {
            return res.status(400).json({ error: data.cause });
        }

        const stats = data.player;
        const analysis = {
            fkdr: calculateFKDR(stats),
            gamesToNextPrestige: estimateNextPrestige(stats),
        };

        res.json({ stats, analysis });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data from Hypixel.' });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
