const express = require('express');
const app = express();
const port = process.env.port || 3000;
const bodyParser = require("body-parser");

//const urlEncoded = bodyParser.urlencoded({extended: false}); Only for login type stuff ig????

var currentCountryList = {
    list: ["Botswana", "France", "Ireland", "United States of America", "Chad", "Holy See", "Thailand", "Togo", "Zambia"]
}

app.use(bodyParser.json());

//express.static.mime.define({"text/css": ["css"]});

app.get('/', (req, res) => {
    res.sendFile("index.html", {root: __dirname});
});

app.get('/worker.js', (req, res) => {
    res.sendFile("worker.js", {root: __dirname});
});

app.get('/style.css', (req, res) => {
    res.type("text/css");
    res.sendFile("style.css", {root: __dirname});
});

app.get("/ComputerModernSerif.ttf", (req, res) => {
    res.sendFile("./fonts/cmunrm.ttf", {root: __dirname});
});

app.get("(/favicon.png|/UN-logo.png)", (req, res) => {
    res.sendFile("./favicon.png", {root: __dirname});
});

app.get("/lib/jquery.js", (req, res) => {
    res.type("text/javascript");
    res.sendFile("./lib/jquery-3.7.1.min.js", {root: __dirname});
});

app.get("/lib/jquery-sortable.js", (req, res) => {
    res.type("text/javascript");
    res.sendFile("./lib/jquery-sortable.js", {root: __dirname});
});

app.get("/lib/Sortable.js", (req, res) => {
    res.type("text/javascript");
    res.sendFile("./lib/Sortable.js", {root: __dirname});
});

app.post("/setcountrylist", (req, res) => {
    currentCountryList = req.body;
    res.status(200).send("All good");
});

app.get("/getcountrylist", (req, res) => {
    res.json(currentCountryList);
});

module.exports.app = app;