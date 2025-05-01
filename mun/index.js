const express    = require("express");
const fs         = require("fs");
const app        = express();
const port       = 3000;
const bodyParser = require("body-parser");

//const urlEncoded = bodyParser.urlencoded({extended: false}); Only for login type stuff ig????

var currentCountryList = {
    list: ["United States of America", "France", "China", "Russia", "United Kingdom"]
}

var savedSaveData = {

}

var jsonParse = bodyParser.json();
app.use(express.json());

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

app.get("/me.png", (req, res) => {
    res.type("image/png");
    res.sendFile("./images/me.png", {root : __dirname});
})

app.post("/savesavedata", jsonParse, (req, res) => {
    if(req.body.id in savedSaveData) {
        savedSaveData[req.body.id] = JSON.stringify(req.body.data);

        res.send(JSON.stringify({
            success : true,
            code    : 201,
            message : "Save data successfully stored, overwriting a previous entry"
        }));
        return;
    }
    if(req.body.id == "DELETE_ALL_SAVES") {
        savedSaveData = [];
        res.send(JSON.stringify({
            success : true,
            code    : 201,
            message : "All save data deleted"
        }));
        return;
    }
    savedSaveData[req.body.id] = req.body.data;
    res.send(JSON.stringify({
        success : true,
        code    : 201,
        message : "Save data successfully stored"
    }));
});

app.post("/getsavedata", jsonParse, (req, res) => {
    if(!("id" in req.body)) {
        res.status(400).send({
            success : false,
            message : "Did not send `id`!"
        });
    }
    if(req.body.id in savedSaveData) {
        res.send(savedSaveData[req.body.id]);
    } else {
        res.send(JSON.stringify({
            success : false,
            code    : 404,
            message : "Data not found"
        }));
    }
});

module.exports.app = app;

module.exports.startUpFunction = function() {
    if(fs.existsSync("./data/mun_save_data.txt")) {
        var d = fs.readFileSync("./data/mun_save_data.txt", "utf-8");

        savedSaveData = JSON.parse(d);
    }
}

module.exports.shutDownFunction = function() {
    console.log("Shutting down MUN...");

    let d = JSON.stringify(savedSaveData);
    fs.writeFileSync("./data/mun_save_data.txt", d, "utf-8", (error) => {
        if(error) console.log(error);
    });
}