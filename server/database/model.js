import { config } from 'dotenv';
import pg from 'pg';
import { SQLqueries } from './queries.js';

config();

const client = new pg.Client({ connectionString: process.env.PG_URI });

const createDatabase = async () => {
    try {
        client.connect(err => {
            if (err) {
                console.error('connection error', err.stack)
            } else {
                console.log('Database connected')
            }
        });

        await client.query(SQLqueries.dropPlayerTable);
        await client.query(SQLqueries.createPlayerTable);
        return true;
    } catch (error) {
        console.error(error.stack);
        return false;
    }
};

createDatabase().then(result => {
    if (result) {
        console.log('Database created');
    }
});

const query = async (text, params) => {
    try {
        const start = Date.now();
        const res = await client.query(text, params);
        const duration = Date.now() - start;
        console.log('executed query', { text, duration, rows: res.rowCount });
        return res;
    } catch (err) {
        console.log(err.stack)
    }
}


const connect = async () => {
    return await client.connect();
}

export { client, query, connect }