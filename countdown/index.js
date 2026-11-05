const express    = require('express');
const bodyParser = require("body-parser");
const fs         = require('fs');

const app = express();

var jsonParse = bodyParser.json();
app.use(express.json());

var paths = {};

eval(`paths = ${fs.readFileSync("./countdown/pages.js").toString()}`);

const rendered = {

};

var ogHtmlFile = fs.readFileSync("./countdown/timer.html").toString();

function renderFile(path) {
    rendered[path] = ogHtmlFile;

    rendered[path] = rendered[path].replace("/* %% DATE REPLACE */", paths[path][0]);
    rendered[path] = rendered[path].replace("/* %% WAITING TIME */", paths[path][1]);
    rendered[path] = rendered[path].replace("<!-- %% TEXT DATE -->", new Date(paths[path][0]).toString().substring(4).slice(0,11));
}

Object.keys(paths).forEach((path) => {
    app.get(`/${path}`, (req, res) => {
        if(!rendered[path]) {
            renderFile(path);
        }

        res.type("html");
        res.send(rendered[path]);
    });
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

module.exports.app = app;

module.exports.startUpFunction = function() {
    // Pass
}

module.exports.shutDownFunction = function() {
    // Pass
}
