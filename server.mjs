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

app.get('/defects', (req, res) => {
    !async function () {
        let data = await fetch(
            "https://docs.google.com/spreadsheets/d/11dPVW6guimG1q7xfwhUXjlkGVo_0kaM3zjyoC0HZS8s/export?format=csv&gid=139691573"
        ).then(response => {
            if (response.status !== 200)
                throw Error()

            return response.text();
        }).then(text => parse(text, { columns: true }));

        res.send({ "defects": data.filter((defect) => defect.selected === "1") });
    }();
})

app.put('/ratings', jsonParser, (req, res) => {
    let body = req.body;
    let time = Date.now();
    body.time = time;
    res.send({ "message": "ok" });
    let userID = body.userID;
    storage.setItem(time.toString(), body).then(() => console.log("data saved"));  // todo add random
    storage.setItem(userID, body).then(() => console.log("data saved"));
})


app.get('/ratings/:userID', (req, res) => {
    storage.getItem(req.params.userID).then((data) => {
        if (data === undefined) {
            res.send({ name: "", expYears: undefined, expGroups: {}, ratings: Array.apply(undefined, { length: 0 }), userID: req.params.userID });
        }
        res.send(data);
    })
})