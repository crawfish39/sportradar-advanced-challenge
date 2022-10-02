// async function gameData(gamePk,status){
//     const game = document.getElementById('gamePk');
//     const gameInput = game.input;
//     game.input = '';
//     const status = document.getElementById('gameStatus');
//     const statusInput = status.input;
//     status.input = '';

//     try {
//         const response = await fetch()

//     } catch {

//     }
// }

async function loadSchedule() {
        const response = await fetch('http://localhost:3001/scheduleData', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const scheduleDB = await response.json();
    console.log(scheduleDB)
}

export { loadSchedule };