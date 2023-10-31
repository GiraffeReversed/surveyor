import express from 'express';
import bodyParser from 'body-parser';
import storage from 'node-persist';
import { URL } from 'url';
import { env } from 'process';

const app = express();
const port = process.env.PORT || 5000;

const jsonParser = bodyParser.json();

await storage.init({ dir: "db" })

// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`));

app.get('/api/defects', (req, res) => {
    res.sendFile("defects.json", { root: new URL('.', import.meta.url).pathname });
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

app.get('/api/export_data/:password', (req, res) => {
    const password = req.params.password;
    if (password !== process.env.PASSWORD)
        res.status(401).send();
    else
        storage.valuesWithKeyMatch('user-latest-').then(values => res.send({ responses: values }));
})