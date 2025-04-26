const express = require('express');

const app = express();
const port = process.env.port || 3000;

var munApp = require('./mun/index').app;

app.use("/mun", munApp);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

app.get("/", (req, res) => {
    res.sendFile("./index.html", {root: __dirname});
});

app.get("/shartell", (req, res) => {
    res.send("Shartell hehe");
});