const express = require("express");
const vhost   = require("vhost");

const app = express();
const port = process.env.port || 3000;

var munFile = require('./mun/index');
var munApp = munFile.app;

process.on("SIGTERM", receivedKillSignal);
process.on("SIGINT",  receivedKillSignal);

app.use(vhost("mun.alex-seltzer.com", munApp));
app.use(vhost("mun.localhost", munApp));

app.get("/mun", (req, res) => {
    res.redirect("https://mun.alex-seltzer.com");
})

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

app.use(function(req, res, next) {
    res.redirect("https://alex-seltzer.com/");
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