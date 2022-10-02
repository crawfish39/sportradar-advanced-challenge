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
              console.log('Database connected')}});

        await client.query(SQLqueries.dropScheduleTable);
        await client.query(SQLqueries.createScheduleTable);
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
    const start = Date.now();
    const res = await client.query(text, params);
    const duration = Date.now() - start;
    console.log('executed query', { text, duration, rows: res.rowCount });
    return res;
}

const connect = async () => {
    return await client.connect();
}

export { client, query, connect }