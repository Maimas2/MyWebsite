const express = require("express");
const vhost   = require("vhost");

const app = express();
const port = process.env.port || 3000;

var munFile = require('./mun/index');
var munApp = munFile.app;

var scibowlFile = require('./scibowlonline/index');
var scibowlApp = scibowlFile.app;

var sbestFile = require("./scibowltopics/index");
var sbestApp = sbestFile.app;

var namesFile = require("./names");
app.use(namesFile.app);

process.on("SIGTERM", receivedKillSignal);
process.on("SIGINT",  receivedKillSignal);

app.use(vhost("mun.alex-seltzer.com", munApp));
app.use(vhost("mun.localhost", munApp));

app.use(vhost("scibowl.alex-seltzer.com", scibowlApp));
app.use(vhost("scibowl.localhost", scibowlApp));

app.use(vhost("sbest.alex-seltzer.com", sbestApp));
app.use(vhost("sbest.localhost", sbestApp));

app.get("/mun", (req, res) => {
    res.redirect("https://mun.alex-seltzer.com");
})

app.get("/", (req, res) => {
    res.sendFile("./index.html", {root: __dirname});
});

app.get("/lib/jquery.js", (req, res) => {
    res.type(".js");
    res.sendFile("./mun/lib/jquery-3.7.1.min.js", {root: __dirname});
});

app.use(function(req, res, next) {
    res.send("404 couldn't find that page :(");
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);

    munFile.setParentShutdownCallback(receivedKillSignal);

    munFile.startUpFunction();
    scibowlFile.startUpFunction();
    sbestFile.startUpFunction();
});

app.listen(3001, () => {
    console.log("WebSocket port is up");
});

function receivedKillSignal() {
    console.log("Shutting down...");
    munFile.shutDownFunction();
    sbestFile.shutDownFunction();

    process.exit(0);
}