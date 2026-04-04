const express    = require('express');
const bodyParser = require("body-parser");
const fs         = require("fs");

const app = express();

var jsonParse = bodyParser.json();
app.use(express.json());

let allResults = {results: []};

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

app.post("/submitresults", (req, res) => {
    console.log(req.body);
    allResults.results.push(req.body);
});

module.exports.app = app;

module.exports.startUpFunction = function() {
    if(fs.existsSync("./saves/form_responses")) {
        var d = fs.readFileSync("./saves/form_responses.txt", "utf-8");

        allResults = JSON.parse(d);
    }
}

module.exports.shutDownFunction = function() {
    let d = JSON.stringify(allResults);
    console.log(allResults);
    fs.writeFileSync("./saves/form_responses.txt", d, "utf-8", (error) => {
        if(error) console.error(error);
    });
}
