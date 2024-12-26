import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./bedwars.db');

export function initDatabase() {
    db.run(`
        CREATE TABLE IF NOT EXISTS player_stats (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            player_name TEXT,
            stats TEXT,
            analysis TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
}

export function savePlayerStats(playerName, stats, analysis) {
    db.run(
        `INSERT INTO player_stats (player_name, stats, analysis) VALUES (?, ?, ?)`,
        [playerName, JSON.stringify(stats), JSON.stringify(analysis)]
    );
}

export function getPlayerStats(playerName) {
    return new Promise((resolve, reject) => {
        db.all(
            `SELECT * FROM player_stats WHERE player_name = ? ORDER BY timestamp DESC`,
            [playerName],
            (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            }
        );
    });
}
