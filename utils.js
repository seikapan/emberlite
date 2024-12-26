export function calculateFKDR(stats) {
    const finalKills = stats?.achievements?.bedwars_final_kills || 0;
    const finalDeaths = stats?.achievements?.bedwars_final_deaths || 1; // Avoid division by zero
    return (finalKills / finalDeaths).toFixed(2);
}

export function estimateNextPrestige(stats) {
    const xp = stats?.achievements?.bedwars_experience || 0;
    const xpPerGame = stats?.stats?.Bedwars?.bedwars_xp_per_game || 500; // Example rate
    const xpToNextPrestige = (Math.floor(xp / 5000) + 1) * 5000 - xp;
    return Math.ceil(xpToNextPrestige / xpPerGame);
}
