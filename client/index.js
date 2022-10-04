document.addEventListener('DOMContentLoaded', e => {

    // monitor submit button to pull back game stats
    document.getElementById('submit')
    .addEventListener('click', e => {
        e.preventDefault();
        const value = document.getElementById('gameURL');
        const input = value.value;
        value.value = '';
        const result = loadGameData(input);
    });
});

async function loadGameData(gameURL) {
    console.log(gameURL)
        const response = await fetch(`http://localhost:3002/NHLdata`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            gameURL: gameURL
        })
    })
    const gameStats = await response.json();
    return gameStats.stats.liveData;
}