import { loadSchedule } from './api.js';

document.addEventListener('DOMContentLoaded', e => {
    setTimeout(loadSchedule, 0);

    // monitor submit button to pull back live game data
    // document.getElementById('liveGames')
    // .addEventListener('submit', e => {
    //     e.preventDefault();
    //     getGameData();
    // });

});