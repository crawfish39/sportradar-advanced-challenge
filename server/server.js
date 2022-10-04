import path from 'path';
import cors from 'cors';
import express, { urlencoded, json } from 'express';
import { scheduleController } from './scheduleController.js';
import { statsController } from './statsController.js';
import cron from 'node-cron';


import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = 3002;

app.use(cors());

app.use(urlencoded({ extended: true }));

app.use(json({ 'Content-Type': 'application/json' }));

app.use('/', express.static(path.join(__dirname, '../client')));

app.get('/', (req, res) => {
    return res.sendFile(path.join(__dirname, '../client/index.html'));
});

cron.schedule('*/10 * * * * *', () => {
    scheduleController.uploadToDatabase(
        scheduleController.monitorGoLive()
        )
}
);

// app.get('/scheduleData',
//     // this is for getting live game data in cron job from db
//     (req, res) => {
//         const body = {
//             schedule: res.locals.reply
//         }
//         res.status(200).json(body);
//     }
// );

app.post('/NHLdata',
    statsController.getGameStats,
    (req, res) => {
        const body = {
            stats: res.locals.stats
        }
        res.status(200).json(body);
    }
);

app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
});

export { app };