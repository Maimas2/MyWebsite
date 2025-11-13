const express    = require('express');
const bodyParser = require("body-parser");

const app = express();

var jsonParse = bodyParser.json();
app.use(express.json());

app.get('/', (req, res) => {
	res.sendFile('index.html', {root: __dirname})
});

app.get('/style.css', (req, res) => {
	res.sendFile('style.css', {root: __dirname})
});

app.get('/vote.js', (req, res) => {
    res.type("application/javascript");
	res.sendFile('vote.js', {root: __dirname})
});

app.get('/iro.min.js', (req, res) => {
	res.sendFile('iro.min.js', {root: __dirname})
});

app.get("/ComputerModernSerif.ttf", (req, res) => {
    res.sendFile("./fonts/cmunrm.ttf", {root: __dirname});
});

app.get('/favicon.png', (req, res) => {
	res.sendFile('favicon.png', {root: __dirname})
});

app.get("/lib/jquery-sortable.js", (req, res) => {
    res.type("text/javascript");
    res.sendFile("./lib/jquery-sortable.js", {root: __dirname});
});

app.get("/lib/Sortable.js", (req, res) => {
    res.type("text/javascript");
    res.sendFile("./lib/Sortable.js", {root: __dirname});
});

module.exports.app = app;

module.exports.startUpFunction = function() {
    // Pass
}

module.exports.shutDownFunction = function() {
    // Pass
}
