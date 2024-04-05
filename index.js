const fs = require('fs');
const axios = require('axios');
const { fetchGameDetails } = require('./IdListToDataSet'); // Import fetchGameDetails
const filters = require('./filters'); // Import filters


async function getGameId(gameName) {
    try {
        const response = await axios.get('http://api.steampowered.com/ISteamApps/GetAppList/v0002/');
        const apps = response.data.applist.apps;

        const game = apps.find(app => app.name.toLowerCase() === gameName.toLowerCase());

        if (game) {
            return game.appid;
        } else {
            console.log(`Game not found: ${gameName}`);
            return null;
        }
    } catch (error) {
        console.error(`Error: ${error}`);
    }
}

async function getGameIds(gameNames) {
    const gameIds = [];
    for (const gameName of gameNames) {
        const gameId = await getGameId(gameName);
        if (gameId) {
            gameIds.push(gameId);
        }
    }
    return gameIds;
}


async function getGameIds(gameNames) {
    const gameIds = [];
    for (const gameName of gameNames) {
        const gameId = await getGameId(gameName);
        if (gameId) {
            gameIds.push(gameId);
        }
    }
    return gameIds;
}

// Read game names from file
fs.readFile('gameNames.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(`Error: ${err}`);
        return;
    }

    const gameNames = data.split('\n').map(name => name.trim()); // Trim each game name
    getGameIds(gameNames).then(gameIds => {
        fetchGameDetails(gameIds, filters); // Call fetchGameDetails with the game IDs
    });
});