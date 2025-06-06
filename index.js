const express    = require("express");
const vhost      = require("vhost");
const fs         = require("fs");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.port || 3000;

var munFile = require('./mun/index');
var munApp = munFile.app;

var scibowlFile = require('./scibowlonline/index');
var scibowlApp = scibowlFile.app;

var sbestFile = require("./scibowltopics/index");
var sbestApp = sbestFile.app;

var namesFile = require("./names");
app.use(namesFile.app);

var textParse = bodyParser.text();
app.use(textParse);

var todoList = "";

process.on("SIGTERM", receivedKillSignal);
process.on("SIGINT",  receivedKillSignal);

app.use(vhost("mun.alex-seltzer.com", munApp));
app.use(vhost("mun.localhost", munApp));

app.use(vhost("scibowl.alex-seltzer.com", scibowlApp));
app.use(vhost("scibowl.localhost", scibowlApp));

app.use(vhost("sbest.alex-seltzer.com", sbestApp));
app.use(vhost("sbest.localhost", sbestApp));

app.get("/mun", (req, res) => {
    res.redirect("https://mun.alex-seltzer.com");
})

app.get("/", (req, res) => {
    res.sendFile("./index.html", {root: __dirname});
});

app.get("/lib/jquery.js", (req, res) => {
    res.type(".js");
    res.sendFile("./mun/lib/jquery-3.7.1.min.js", {root: __dirname});
});

app.post("/settodo", textParse, (req, res) => {
    todoList = req.body;
    //console.log(req.body);
    res.status(200).send("Set todo list");
});

app.get("/gettodo", (req, res) => {
    res.send(todoList);
});

app.use(function(req, res, next) {
    res.send("404 couldn't find that page :(");
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
    
    munFile.setParentShutdownCallback(receivedKillSignal);

    munFile.startUpFunction();
    scibowlFile.startUpFunction();
    sbestFile.startUpFunction();

    if(fs.existsSync("./saves/todo_list.txt")) {
        var d = fs.readFileSync("./saves/todo_list.txt", "utf-8");
        //console.log(d);
        todoList = d;
    } else {
        console.warn("Could not find Todo list file!!!");
    }
});

app.listen(3001, () => {
    console.log("WebSocket port is up");
});

function receivedKillSignal() {
    console.log("Shutting down...");
    munFile.shutDownFunction();
    sbestFile.shutDownFunction();

    fs.writeFileSync("./saves/todo_list.txt", todoList, "utf-8", (error) => {
        if(error) console.log(error);
    });

    process.exit(0);
}