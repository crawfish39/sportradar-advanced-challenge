const SQLqueries = {};

SQLqueries.createScheduleTable = `CREATE TABLE IF NOT EXISTS schedule (
    PlayerID INT,
    PlayerName VARCHAR(255),
    TeamID INT,
    TeamName VARCHAR(255),
    PlayerAge INT,
    PlayerNumber INT,
    PlayerPosition VARCHAR(255),
    Assists INT,
    Goals INT,
    Hits INT,
    Points INT,
    PenaltyMinutes INT
);`

SQLqueries.dropScheduleTable = `DROP TABLE IF EXISTS schedule;`

SQLqueries.declareJSON = `DECLARE @jsonData NVARCHAR(MAX);`


export { SQLqueries }