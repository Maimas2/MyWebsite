const express = require('express');
const app = express();
const port = process.env.port || 3000;
const bodyParser = require("body-parser");

//const urlEncoded = bodyParser.urlencoded({extended: false}); Only for login type stuff ig????

var currentCountryList = {
    list: ["Botswana", "France", "Ireland", "United States of America", "Chad", "Holy See", "Thailand", "Togo", "Zambia"]
}

app.use(bodyParser.json());

var usableDirname = __dirname;

//express.static.mime.define({"text/css": ["css"]});

app.get('/', (req, res) => {
    res.sendFile("index.html", {root: usableDirname});
});

app.get('/worker.js', (req, res) => {
    res.sendFile("worker.js", {root: usableDirname});
});

app.get('/style.css', (req, res) => {
    res.type("text/css");
    res.sendFile("style.css", {root: usableDirname});
});

app.get("/ComputerModernSerif.ttf", (req, res) => {
    res.sendFile("./fonts/cmunrm.ttf", {root: usableDirname});
});

app.get("/favicon.png", (req, res) => {
    res.sendFile("./favicon.png", {root: __dirname});
});

app.get("/UN-logo.png", (req, res) => {
    res.sendFile("./favicon.png", {root: __dirname});
});

app.get("/lib/jquery.js", (req, res) => {
    res.type("text/javascript");
    res.sendFile("./lib/jquery-3.7.1.min.js", {root: usableDirname});
});

app.get("/lib/jquery-sortable.js", (req, res) => {
    res.type("text/javascript");
    res.sendFile("./lib/jquery-sortable.js", {root: usableDirname});
});

app.get("/lib/Sortable.js", (req, res) => {
    res.type("text/javascript");
    res.sendFile("./lib/Sortable.js", {root: usableDirname});
});

app.post("/setcountrylist", (req, res) => {
    currentCountryList = req.body;
    res.status(200).send("All good");
});

app.get("/getcountrylist", (req, res) => {
    res.json(currentCountryList);
});

module.exports.app = app;