const express    = require('express');
const fs         = require("fs");
const fileUpload = require('express-fileupload');
const path       = require("path");

const app = express();

app.use(fileUpload({
    limits : { fileSize : 2 * 1024 * 1024 } // Max filesize: 2MB
}));

const pw = fs.readFileSync("./files-pw.txt", "utf-8");

var isFilesPortalOpen = false;

app.get('/', (req, res) => {
    if(isFilesPortalOpen) {
        res.sendFile('index.html', {root: __dirname});
    } else {
        res.send("Files portal is currently closed.");
    }
});

app.get('/style.css', (req, res) => {
    if(isFilesPortalOpen) {
        res.sendFile('style.css', {root: __dirname});
    } else {
        res.send("Files portal is currently closed.");
    }
});

app.get('/files.js', (req, res) => {
	if(isFilesPortalOpen) {
        res.sendFile('files.js', {root: __dirname});
    } else {
        res.send("Files portal is currently closed.");
    }
});

app.get("/deposit/*splat", (req, res) => {
    if(isFilesPortalOpen) {
        if(req.url.includes("..")) {
            res.send("Don't even try it.");
            return;
        }
        if(fs.existsSync(__dirname + req.url)) {
            res.sendFile(req.url, {root: __dirname});
        } else {
            res.send("File not found.");
        }
    } else {
        res.send("Files portal is currently closed.");
    }
});

app.get("/togglefilesportal", (req, res) => {
    if(req.url.includes(pw.replace("\n", ""))) {
        isFilesPortalOpen = !isFilesPortalOpen;
        res.send(`PortalOpen is: ${isFilesPortalOpen}`);
    } else {
        res.send("Invalid identification.");
    }
});

app.get("/isportalopen", (req, res) => {
    res.send(`PortalOpen is: ${isFilesPortalOpen}`);
});

app.post("/fileupload", (req, res) => {
    if(!req.files || !Object.keys(req.files).length) {
        res.send("No files attached.");
        return;
    }

    let file = req.files.mainfile;

    if(fs.existsSync(path.join(__dirname, "/deposit", file.name))) {
        fs.unlinkSync(path.join(__dirname, "/deposit", file.name));
    }

    file.mv(path.join(__dirname, "/deposit", file.name));
    res.send("File uploaded.");
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
