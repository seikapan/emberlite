import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { calculateFKDR, estimateNextPrestige } from './utils.js';
import { initDatabase, savePlayerStats, getPlayerStats } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

initDatabase();

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});


// Initialize the database
initDatabase();

// API Route: Fetch stats from Hypixel and analyze
app.get('/api/stats/:player', async (req, res) => {
    const playerName = req.params.player;
    const apiKey = process.env.HYPIXEL_API_KEY;

    try {
        const response = await fetch(`https://api.hypixel.net/player?key=${apiKey}&name=${playerName}`);
        const data = await response.json();

        if (!data.success) {
            return res.status(400).json({ error: data.cause });
        }

        const stats = data.player;
        const analysis = {
            fkdr: calculateFKDR(stats),
            gamesToNextPrestige: estimateNextPrestige(stats),
        };

        // Save stats to the database
        savePlayerStats(playerName, stats, analysis);

        res.json({ stats, analysis });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data from Hypixel.' });
    }
});

// API Route: Fetch historical stats from the database
app.get('/api/history/:player', async (req, res) => {
    const playerName = req.params.player;

    try {
        const stats = await getPlayerStats(playerName);
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch stats from database.' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
