const SQLqueries = {};

SQLqueries.createPlayerTable = `CREATE TABLE IF NOT EXISTS players (
    player_id INT PRIMARY KEY,
    player_name VARCHAR(255),
    team_id INT,
    team_name VARCHAR(255),
    player_age INT,
    player_number INT,
    player_position VARCHAR(255),
    assists INT,
    goals INT,
    hits INT,
    points INT,
    penalty_minutes INT
);`

SQLqueries.dropPlayerTable = `DROP TABLE IF EXISTS players;`

SQLqueries.setJSON = j => `BEGIN;
SET CONSTRAINTS ALL DEFERRED;
INSERT INTO players
SELECT *
FROM json_populate_recordset (NULL::players, '${j}');
COMMIT;;`


export { SQLqueries }
