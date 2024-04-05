const fetchGameDetails = async (appids, filters) => {
    const createCsvWriter = require('csv-writer').createObjectCsvWriter;
    const fs = require('fs');

    try {
        // Fetch the game details for each appid
        const gameDataPromises = appids.map(appid => fetchSingleGameDetail(appid, filters));
        const gamesData = await Promise.all(gameDataPromises);

        var filteredData = gamesData.map(game => {
            const filteredGame = {};
            filters.forEach(filter => {
                filteredGame[filter] = game[filter];
            });

            //add a field called "language count" that counts the number of languages the game supports
            filteredGame['language count'] = game.languages.length;

            return filteredGame;
        });

        const csvWriter = createCsvWriter({
            path: 'games.csv',
            header: Object.keys(filteredData[0]).map(key => ({ id: key, title: key })),
        });

        csvWriter.writeRecords(filteredData)
            .then(() => console.log('json done'))
            .catch(error => console.error(`Error: ${error}`));

        // Write the filtered data to a file
        fs.writeFile('games.json', JSON.stringify(filteredData, null, 2), (err) => {
            if (err) throw err;
            console.log('spreadheet done');
        });

    } catch (error) {
        console.error(`Error: ${error}`);
    }
};


const fetchSingleGameDetail = async (appid, filters) => {
    const fetchModule = await import('node-fetch');
    const fetch = fetchModule.default;

    // Create the URL with the appid
    const url = `https://api.gamalytic.com/game/${appid}?fields=${filters.join(',')}`;

    try {
        console.log(`Fetching game details from: ${url}`);
        // Fetch the game details
        const response = await fetch(url);
        const data = await response.json();

        return data;
    } catch (error) {
        console.error(`Error: ${error}`);
    }
};

module.exports.fetchGameDetails = fetchGameDetails;
module.exports.fetchSingleGameDetail = fetchSingleGameDetail;
