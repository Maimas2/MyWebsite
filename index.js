const express = require('express');

const app = express();
const port = process.env.port || 3000;

var munFile = require('./mun/index');
var munApp = munFile.app;

app.use("/mun", munApp);

process.on("SIGTERM", receivedKillSignal);
process.on("SIGINT",  receivedKillSignal);

app.get("/", (req, res) => {
    res.sendFile("./index.html", {root: __dirname});
});

app.get("/shartell", (req, res) => {
    res.send("Shartell hehe");
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);

    munFile.startUpFunction();
});

function receivedKillSignal() {
    console.log("Shutting down...");
    munFile.shutDownFunction();

    process.exit(0);
}