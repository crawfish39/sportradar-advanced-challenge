const scheduleController = {};

scheduleController.monitorGoLive = async () => {
    try {
        const scheduleData = await getSchedule();
        // check which games are going on right now
        const todaysGames = scheduleData.dates[0].games;
        for (let i = 0; i < todaysGames.length; i++) {
            console.log(todaysGames[i].status.detailedState)
            if (todaysGames[i].status.detailedState === 'In Progress') {
                const gameData = await getGameData(todaysGames[i].link);
                console.log(gameData.gamePk)
            }

            const parsedPlayerData = {};

            const gameData = await getGameData('/api/v1/game/2022010062/feed/live');
            const players = gameData.gameData.players;
            for(const player in players) {
                parsedPlayerData [players[player].id] = {
                    "PlayerID" :  players[player].id,
                    "PlayerName" : players[player].hasOwnProperty('fullName') ? players[player].fullName : '',
                    "TeamID" : players[player].hasOwnProperty('currentTeam') ? players[player].currentTeam.id : null,
                    "TeamName" : players[player].hasOwnProperty('currentTeam') ? players[player].currentTeam.name : '',
                    "PlayerAge" : players[player].hasOwnProperty('currentAge') ? players[player].currentAge : null,
                    "PlayerNumber" : players[player].hasOwnProperty('primaryNumber') ? players[player].primaryNumber : null,
                    "PlayerPosition" : players[player].hasOwnProperty('primaryPosition') ? players[player].primaryPosition.name : '',
                    "Assists" : 0,
                    "Goals" : 0,
                    "Hits" : 0,
                    "Points" : 0,
                    "PenaltyMinutes" : 0
                }
                    
            }
            const liveDataAway = gameData.liveData.boxscore.teams.away.players;
            const liveDataHome = gameData.liveData.boxscore.teams.home.players;
            statHelper(liveDataAway);
            statHelper(liveDataHome);
            function statHelper(liveDataTeam){
                for(const player in liveDataTeam) {
                    if(liveDataTeam[player].stats.hasOwnProperty('skaterStats')) {
                        parsedPlayerData[liveDataTeam[player].person.id]["Assists"] = liveDataTeam[player].stats['skaterStats'].assists;
                        parsedPlayerData[liveDataTeam[player].person.id]["Goals"] = liveDataTeam[player].stats['skaterStats'].goals;
                        parsedPlayerData[liveDataTeam[player].person.id]["Hits"] = liveDataTeam[player].stats['skaterStats'].hits;
                        parsedPlayerData[liveDataTeam[player].person.id]["Points"] = liveDataTeam[player].stats['skaterStats'].shots;
                        parsedPlayerData[liveDataTeam[player].person.id]["PenaltyMinutes"] = liveDataTeam[player].stats['skaterStats'].penaltyMinutes;
                    }
                }
            }
            return JSON.stringify(parsedPlayerData);
        }
    } catch (err) {
        console.log('monitorGoLive: ERROR: ', err)
    }
}

// fetch up to date data when server loads
async function getSchedule() {
    const response = await fetch('https://statsapi.web.nhl.com/api/v1/schedule', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    return response.json()
}

async function getGameData(url) {
    // const { gamePk, status } = req.body;
    // console.log(req.body)
    try {
        // if (!gamePk || !status) return res.status(400).json({ 'message': 'Missing gamePk or status from submission' });
        const response = await fetch(`https://statsapi.web.nhl.com`+ url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        return response.json();
    } catch (err) {
        console.log('getGameData: ERROR: ', err)
    }
}

export { scheduleController }