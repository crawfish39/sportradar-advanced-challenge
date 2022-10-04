import { SQLqueries } from "./database/queries.js";
import { client, query } from './database/model.js';
import fs from 'fs'

const scheduleController = {};

scheduleController.uploadToDatabase = async jsonData => {
    const input = await jsonData;
    // const test = JSON.stringify(JSON.parse(input).slice());
    // fs.writeFile("input.json", test, (err) => {
    //     if (err)
    //       console.log(err);
    //     else {
    //       console.log("File written successfully");
    //     }
    //   });
    // try {
    //     JSON.parse(input)
    //     console.log('IS JSON')
    // } catch {
    //     console.log('notjson')
    // }

    //   console.log(SQLqueries.setJSON(test))
    await query(SQLqueries.dropPlayerTable);
    await query(SQLqueries.createPlayerTable);
    const output = await client.query(SQLqueries.setJSON(input))
}


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
            for (const player in players) {
                parsedPlayerData[players[player].id] = {
                    "player_id": players[player].id,
                    "player_name": players[player].hasOwnProperty('fullName') ? players[player].fullName.replace(/[^a-z]/gi,' ') : '',
                    "team_id": players[player].hasOwnProperty('currentTeam') ? players[player].currentTeam.id : null,
                    "team_name": players[player].hasOwnProperty('currentTeam') ? players[player].currentTeam.name : '',
                    "player_age": players[player].hasOwnProperty('currentAge') ? players[player].currentAge : null,
                    "player_number": players[player].hasOwnProperty('primaryNumber') ? players[player].primaryNumber : null,
                    "player_position": players[player].hasOwnProperty('primaryPosition') ? players[player].primaryPosition.name : '',
                    "assists": 0,
                    "goals": 0,
                    "hits": 0,
                    "points": 0,
                    "penalty_minutes": 0
                }

            }
            const liveDataAway = gameData.liveData.boxscore.teams.away.players;
            const liveDataHome = gameData.liveData.boxscore.teams.home.players;
            statHelper(liveDataAway);
            statHelper(liveDataHome);
            function statHelper(liveDataTeam) {
                for (const player in liveDataTeam) {
                    if (liveDataTeam[player].stats.hasOwnProperty('skaterStats')) {
                        parsedPlayerData[liveDataTeam[player].person.id]["assists"] = liveDataTeam[player].stats['skaterStats'].assists;
                        parsedPlayerData[liveDataTeam[player].person.id]["goals"] = liveDataTeam[player].stats['skaterStats'].goals;
                        parsedPlayerData[liveDataTeam[player].person.id]["hits"] = liveDataTeam[player].stats['skaterStats'].hits;
                        parsedPlayerData[liveDataTeam[player].person.id]["points"] = liveDataTeam[player].stats['skaterStats'].shots;
                        parsedPlayerData[liveDataTeam[player].person.id]["penalty_minutes"] = liveDataTeam[player].stats['skaterStats'].penaltyMinutes;
                    }
                }
            }
            return JSON.stringify(Object.values(parsedPlayerData));
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
        const response = await fetch(`https://statsapi.web.nhl.com` + url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        return response.json();
    } catch (err) {
        console.log('getGameData: ERROR: ', err)
    }
}

export { scheduleController }