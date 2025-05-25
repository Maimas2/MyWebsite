const exp = require('constants')
const express = require('express')
const fs = require('fs')
const { parse } = require('path')

const app = express()
const port = 3000

var pageHierarchy = {}

var namePageNlink = {} // Table of name-absolute path links for name-links to use in redirects

class PageClass {
    name;
    fancyName;
    description;
    subtopics;
    fullText;
    subtopicName; // Name of the subtopic to be listed under

    constructor() {
        this.name         = "";
        this.fancyName    = "";
        this.description  = "";
        this.fullText     = "";
        this.subtopics    = [];
        this.subtopicName = "main";
    }
}

app.get('/', (req, res) => {
    res.redirect("/topics/");
    // TODO : Implement actual home screen
});

app.get("/favicon.(png|ico)", (req, res) => {
    res.sendFile("./favicon.png", {root: __dirname});
});

app.get("/reader.css", (req, res) => {
    res.type("text/css");
    res.sendFile("./reader.css", {root: __dirname});
});

app.get("/reader.js", (req, res) => {
    res.type("text/javascript");
    res.sendFile("./reader.js", {root: __dirname});
});

app.get("/topics/*", (req, res) => {
    if(!req.url.endsWith("/")) {
        res.redirect(req.url + "/");
    } else {
        res.sendFile("reader.html", {root: __dirname});
    }
});

app.get("/jquery.js", (req, res) => {
    res.sendFile("jquery-3.7.1.min.js", {root: __dirname});
});

app.get("/images/*", (req, res) => {
    var imageName = decodeURI(req.url).split("/").pop();
    if(fs.existsSync(__dirname + "/staticimages/images/" + imageName)) {
        res.sendFile("./staticimages/images/" + imageName, {root: __dirname});
    } else {
        res.status(404).send("Sorry not found :(");
    }
});

app.get("/nlink/*", (req, res) => {
    var nLinkPageName = decodeURI(req.url.slice(7));
    if(nLinkPageName in namePageNlink) {
        res.redirect(namePageNlink[nLinkPageName]);
    } else {
        res.send("KILL YOURSELF");
    }
});

var currentPage; // ONLY TO BE USED IN THE `/api/*` RETURN FUNCTION

app.get('/api/*', (req, res) => {
    var pathTrace = (req.url.slice(5)).split("/"); // Remove the starting /api/ and split it into subpages
    if(pathTrace[pathTrace.length-1] == "") pathTrace.splice(pathTrace.length-1, 1);

    //console.log(pathTrace);

    currentPage = pageHierarchy;
    var stackTrace = [];
    var stackTraceUrls = [];

    var scrollTo = "";

    var i = 0;
    while(++i < pathTrace.length) {
        var found = false;
        for(var ii = 0; ii < currentPage.subtopics.length; ii++) {
            var page = currentPage.subtopics[ii];
            if(page.name == pathTrace[i]) {
                currentPage = page;

                stackTrace.push(page.fancyName);
                stackTraceUrls.push(page.name);

                found = true;
                break;
            }
        }

        if(found) continue;
        
        if(pathTrace[pathTrace.length-1] == currentPage.name) break;

        res.send(JSON.stringify({ // Subpage not found
            success : false,
            code    : 404,
            temp    : currentPage.name
        }));
        return;
    }

    if(stackTrace.length) stackTrace.pop();

    var toSend = {
        success        : true,
        type           : "page",
        name           : currentPage.name,
        fancyName      : currentPage.fancyName,
        description    : currentPage.description,
        fullText       : currentPage.fullText,
        subtopics      : [],
        stackTrace     : stackTrace,
        stackTraceUrls : stackTraceUrls,
        scrollToId     : scrollTo
    };

    for(var i = 0; i < currentPage.subtopics.length; i++) {
        toSend.subtopics.push({
            name         : currentPage.subtopics[i].name,
            fancyName    : currentPage.subtopics[i].fancyName,
            description  : currentPage.subtopics[i].description,
            subtopicName : currentPage.subtopics[i].subtopicName,
        });
    }

    res.send(JSON.stringify(toSend));
});

function parseFile(path) {
    var toReturn = new PageClass();

    var txt = fs.readFileSync(path, {encoding: 'utf-8'}); // Parse index.rtd text
    var lines = txt.split("\n");

    var t = path.split("/");
    if(path.endsWith("index.rtd")) {
        toReturn.name = t[t.length-2];
    } else {
        toReturn.name = t[t.length-1].split(".")[0];
    }

    for(var i = 0; i < lines.length; i++) {
        if(lines[i].startsWith("PageDisplayTitle")) {
            toReturn.fancyName = lines[i].split(":")[1];
            lines.splice(i--, 1);
            continue;
        } else if(lines[i].startsWith("PageDescription")) {
            toReturn.description = lines[i].split(":")[1];
            lines.splice(i--, 1);
            continue;
        } else if(lines[i].startsWith("SubtopicName")) {
            toReturn.subtopicName = lines[i].split(":")[1];
            lines.splice(i--, 1);
            continue;
        }
    }

    while(lines[0].trim() == "") {
        lines.splice(0, 1);
    }

    toReturn.fullText = lines.join("\n");

    namePageNlink[toReturn.fancyName] = path.replace(".rtd", "").replace("/index", "").substring(1);

    return toReturn;
}

function readOverFolder(path) { // ALL WORKING FILE PATHS MUST HAVE A TRAILING SLASH
    var toReturn;
    if(fs.existsSync(path + "index.rtd")) {
        toReturn = parseFile(path + "index.rtd");
    } else {
        return null; // Couldn't find index.rtd
    }
    fs.readdirSync(path).forEach(file => {
        if(file.endsWith("index.rtd")) {
            // Done
        } else if(!file.startsWith(".")) {
            if(fs.lstatSync(path + file).isDirectory()) {
                var t = readOverFolder(path + file + "/");
                if(t != null) toReturn.subtopics.push(t);
            } else if(file.endsWith(".rtd")) {
                toReturn.subtopics.push(parseFile(path + file))
            }
        }
    });
    return toReturn;
}

/* app.get("/reloadList", (req, res) => {
    pageHierarchy = readOverFolder("./topics/");
    console.log("Reloaded data files");
    res.send("Reloaded");
}); */

exports.app = app;

exports.startUpFunction = function() {
    console.log("Reading over SBEST data files...");
    pageHierarchy = readOverFolder("./scibowltopics/topics/");
}

exports.shutDownFunction = function() {

}