import { parse } from 'csv-parse/sync';
import express from 'express';
import bodyParser from 'body-parser';
import storage from 'node-persist';

const app = express();
const port = process.env.PORT || 5000;

const jsonParser = bodyParser.json();

await storage.init({ dir: "db" })

// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`));

app.get('/api/defects', (req, res) => {
    !async function () {
        let data = await fetch(
            "https://docs.google.com/spreadsheets/d/11dPVW6guimG1q7xfwhUXjlkGVo_0kaM3zjyoC0HZS8s/export?format=csv&gid=1135102307"
        ).then(response => {
            if (response.status !== 200)
                throw Error()

            return response.text();
        }).then(text => parse(text, { columns: true }));

        res.send({ "defects": data.filter((defect) => defect.selected === "1") });
    }();
})

app.put('/api/ratings', jsonParser, (req, res) => {
    let body = req.body;
    let time = Date.now();
    body.time = time;

    let userID = body.userID;
    const historyID = `history-${time.toString()}-${userID}`;
    const userLatestID = `user-latest-${userID}`;

    storage.setItem(historyID, body).then(() => console.log(`data saved: ${historyID}`));
    storage.setItem(userLatestID, body).then(() => console.log(`data saved: ${userLatestID}`));

    res.send({ "message": "ok" });
})


app.get('/api/ratings/:userID', (req, res) => {
    const userID = req.params.userID;
    const userLatestID = `user-latest-${userID}`;

    storage.getItem(userLatestID).then((data) => {
        if (data === undefined) {
            res.status(404).send("There is no saved state for that user.")
        }
        res.send(data);
    })
})