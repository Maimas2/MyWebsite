const express    = require("express");
const vhost      = require("vhost");
const fs         = require("fs");
const bodyParser = require("body-parser");

const app = express();
const ews = require("express-ws")(app);
const port = process.env.port || 3000;

var listOfSubdomainFiles = []

var namesFile = require("./names");
app.use(namesFile.app);

var textParse = bodyParser.text();
app.use(textParse);

var todoList = "";

process.on("SIGTERM", receivedKillSignal);
process.on("SIGINT",  receivedKillSignal);

var sdl = fs.readFileSync("./subdomains.txt", "utf8")

var l = sdl.split("\n");

for(var i = 0; i < l.length; i++) {
    let b = l[i];
    if(b.trim() == "") continue;
    try {
        var tf = require(`./${b.split(" ")[1]}/index`);
        listOfSubdomainFiles.push(tf);
        tf.startUpFunction();
        var tapp = tf.app;
        app.use(vhost(b.split(" ")[0] + ".localhost", tapp));
        app.use(vhost(b.split(" ")[0] + ".alex-seltzer.com", tapp));
    } catch(e) {
        console.warn(`Could not find subdomain ${b.split(" ")[0]}, skipping...`);
    }
}

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

app.use(function(req, res, next) {
    res.send("404 couldn't find that page :(");
});


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

function receivedKillSignal() {
    console.log("Shutting down...");
    
    for(f in listOfSubdomainFiles) {
        if(f.shutDownFunction) {
            console.log("Shutting down " + f + "...");
            f.shutDownFunction();
        }
    }

    fs.writeFileSync("./saves/todo_list.txt", todoList, "utf-8", (error) => {
        if(error) console.log(error);
    });

    process.exit(0);
}
