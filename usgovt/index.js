const express    = require('express');
const bodyParser = require("body-parser");

const app = express();

var jsonParse = bodyParser.json();
app.use(express.json());

const port = 3000;

app.get('/', (req, res) => {
	res.sendFile('index.html', {root: __dirname})
});

app.get('/style.css', (req, res) => {
	res.sendFile('style.css', {root: __dirname})
});

app.get('/style.js', (req, res) => {
	res.sendFile('style.js', {root: __dirname})
});

app.get("/ComputerModernSerif.ttf", (req, res) => {
    res.sendFile("./fonts/cmunrm.ttf", {root: __dirname});
});

app.get("/lib/jquery.js", (req, res) => {
    res.sendFile("./jquery-3.7.1.min.js", {root: __dirname});
});

app.use(express.static("static"));

module.exports.app = app;

module.exports.startUpFunction = function() {
    // Pass
}

module.exports.shutDownFunction = function() {
    // Pass
}
