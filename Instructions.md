write HTML page that has:
- field for entering gamePk and status
- pull back game data all when page loads

ingest game data. async function monitors game status

when a game starts / goes live (gameDate)
- watch game status status { abstractGameState = "Live"}

if a game goes live then the game link fetch request is made and data written to db.

if it is off-season, then we should be able to reload data for a provided season or game