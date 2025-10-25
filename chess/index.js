// This chess game's source code is not currently posted, although I am going to in the immediate future

const express = require('express');

const app = express()

app.get("/Chess.apple-touch-icon.png", (req, res) => {
    res.type("png");
    res.sendFile("./Chess.apple-touch-icon.png", {root : __dirname});
});

app.get("/Chess.audio.position.worklet.js", (req, res) => {
    res.type("application/javascript");
    res.sendFile("./Chess.audio.position.worklet.js", {root : __dirname});
});

app.get("/Chess.audio.worklet.js", (req, res) => {
    res.type("application/javascript");
    res.sendFile("./Chess.audio.worklet.js", {root : __dirname});
});

app.get("/Chess.icon.png", (req, res) => {
    res.type("png");
    res.sendFile("./Chess.icon.png", {root : __dirname});
});

app.get("/Chess.js", (req, res) => {
    res.type("application/javascript");
    res.sendFile("./Chess.js", {root : __dirname});
});

app.get("/Chess.pck", (req, res) => {
    res.sendFile("./Chess.pck", {root : __dirname});
});

app.get("/Chess.png", (req, res) => {
    res.type("png");
    res.sendFile("./Chess.png", {root : __dirname});
});

app.get("/Chess.wasm", (req, res) => {
    res.type("application/wasm");
    res.sendFile("./Chess.wasm", {root : __dirname});
});

app.get("/", (req, res) => {
    res.sendFile("./index.html", {root : __dirname});
});

exports.app = app;

exports.startUpFunction = function() {
    
}

exports.shutDownFunction = function() {

}
