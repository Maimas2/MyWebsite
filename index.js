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
    res.send("Shart hehe");
});

app.get("/lordprotector", (req, res) => {
    res.send("All hail Lord Protector Cheney ✊");
});

app.get("/pesko", (req, res) => {
    res.send("Pesto");
});

app.get("/virtue", (req, res) => {
    res.send("Bro we only got to WWII 💀");
});

app.get("/basset", (req, res) => {
    res.send("Bro we forgot to use sig figs 💀");
});

app.get("/collins", (req, res) => {
    res.send("yoink");
});

app.get("/waz", (req, res) => {
    res.send("Regardez mon prof, mec, je vais rater 💀");
});

app.get("/ben-stewart", (req, res) => {
    res.redirect("https://en.wikipedia.org/wiki/Gay");
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