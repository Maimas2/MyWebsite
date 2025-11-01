const express    = require("express");
const vhost      = require("vhost");
const fs         = require("fs");
const bodyParser = require("body-parser");

const app = express();
const ews = require("express-ws")(app);
var port = 3010;

var listOfSubdomainFiles = []

var namesFile = require("./names");
app.use(namesFile.app);

var textParse = bodyParser.text();
app.use(textParse);

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
	port += 1;
        tapp.listen(port);
	console.log(`${b} is listening on port ${port}`);
    } catch(e) {
        console.warn(`Could not find subdomain ${b.split(" ")[0]}, skipping...`);
        console.warn(e);
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


app.listen(3000, () => {
    console.log(`Listening on port 3000`);
});

function receivedKillSignal() {
    console.log("Shutting down...");
    
    for(f in listOfSubdomainFiles) {
        if(f.shutDownFunction) {
            console.log("Shutting down " + f + "...");
            f.shutDownFunction();
        }
    }

    process.exit(0);
}
