const express    = require("express");
const fs         = require("fs");
const bodyParser = require("body-parser");

const app = express();
const ews = require("express-ws")(app);
var port = 3010;

var listOfSubdomainFiles = []

var namesFile = require("./names");
var useragent = require("express-useragent");
app.use(namesFile.app);

var textParse = bodyParser.text();
app.use(textParse);

var jsonParse = bodyParser.json();
app.use(jsonParse);

app.use(useragent.express());

process.on("SIGTERM", receivedKillSignal);
process.on("SIGINT",  receivedKillSignal);

var sdl = fs.readFileSync("./subdomains.txt", "utf8")

var l = sdl.split("\n");

for(var i = 0; i < l.length; i++) {
    let b = l[i].split("#")[0].trim();
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

var listpw = null;

if(fs.existsSync("./listpw.txt")) {
    var d = fs.readFileSync("./listpw.txt", "utf-8");
    listpw = d.replaceAll("\n", "");
} else {
    console.warn("Could not find listpw.txt!!!");
}

app.get("/mun", (req, res) => {
    res.redirect("https://mun.alex-seltzer.com");
});

app.get("/cmu.ttf", (req, res) => {
    res.sendFile("./mun/fonts/cmunrm.ttf", {root: __dirname})
});

app.get("/jquery.js", (req, res) => {
    res.sendFile("./mun/lib/jquery-3.7.1.min.js", {root: __dirname});
});

var listsToSend = [];

var blockedIps = [];

function useragentToString(ua, req) { // Custom function to id a device based on certain immutable characteristics
    return `${ua.os} ${ua.browser} ${ua.isMobile} ${req.headers["x-forwarded-for"]}`
}

if(fs.existsSync("./saves/blocked_ips.txt")) {
    var d = fs.readFileSync("./saves/blocked_ips.txt", "utf-8");

    blockedIps = d.split("\n");
}

app.get("/annoyinglist", (req, res) => {
    if(req.url.includes(listpw) && req.url.includes("&all") && listpw != null) {
        res.send(`[${listsToSend.join(", ")}]`);
    } else if(req.url.includes(listpw) && listpw != null) {
        if(listsToSend.length) {
            res.send(listsToSend.pop());
        } else {
            res.send("");
        }
    } else {
        res.send("Invalid identification")
    }
});

app.post("/appendtoannoyinglist", (req, res) => {
    var u = useragentToString(req.useragent, req);
    if(blockedIps.includes(u)) {
        res.send("This device is blocked.");
    } else {
        listsToSend.unshift(req.body.data);
        blockedIps.push(u);
        res.send("Appended.");
    }
});

app.get("/annoyme", (req, res) => {
    var u = useragentToString(req.useragent, req);
    if(blockedIps.includes(u)) {
        res.sendFile("./annoyme-refusal.html", {root: __dirname});
    } else {
        res.sendFile("./annoyme.html", {root: __dirname});
    }
});

app.get("/", (req, res) => {
    res.sendFile("./index.html", {root: __dirname});
});

app.get("/feed.xml", (req, res) => {
    res.sendFile("./feed.xml", {root: __dirname});
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

    let d = blockedIps.join("\n");
    fs.writeFileSync("./saves/blocked_ips.txt", d, "utf-8", (error) => {
        if(error) console.log(error);
    });

    process.exit(0);
}
