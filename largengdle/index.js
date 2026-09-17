const express    = require('express');
const bodyParser = require("body-parser");

const generator  = require("./generate");

const app = express();

var jsonParse = bodyParser.json();
app.use(express.json());

app.get('/style.css', (req, res) => {
	res.sendFile('style.css', {root: __dirname})
});

app.get('/largengdle.js', (req, res) => {
	res.sendFile('largengdle.js', {root: __dirname})
});
app.get('/listofbadges.js', (req, res) => {
	res.sendFile('listofbadges.js', {root: __dirname})
});

app.get("/ComputerModernSerif.ttf", (req, res) => {
    res.sendFile("./fonts/cmunrm.ttf", {root: __dirname});
});

app.get("/generatenumber", (req, res) => {
	let n = null;
	if(req.originalUrl.split("?").length > 1) {
		n = BigInt(req.originalUrl.split("?")[1]);
	}
	let d = generator.generateInfo(n);
	res.send(JSON.stringify(d));
});

app.get(/^\//, (req, res) => {
	res.sendFile('index.html', {root: __dirname})
});

module.exports.app = app;

module.exports.startUpFunction = function() {
    // Pass
}

module.exports.shutDownFunction = function() {
    // Pass
}
