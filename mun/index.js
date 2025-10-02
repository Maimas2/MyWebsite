const express    = require("express");
const fs         = require("fs");
const app        = express();
const port       = 3000;
const bodyParser = require("body-parser");
const useragent  = require('express-useragent');
const ews        = require("express-ws")(app);
const path       = require("path");

var parentShutdownFunction;

var savedSaveData = {

}

var jsonParse = bodyParser.json();
app.use(express.json());

app.use(useragent.express());

var usableDirname = __dirname;

var unsortedWs = new Set();

var adminPasswords = {
    // Loaded at runtime
};

class BigScreen {
    ws;
    salt;
    constructor(nws, nsalt) {
        this.ws = nws;
        this.salt = nsalt;
    }
}

class PassedPaper {
    name;
    committeeName;

    constructor() {
        this.name          = "";
        this.committeeName = "";
    }
}

class JCCclass {
    salt; // Internal password sorta thing idk
    name;
    password;
    bigScreenConnections;
    chatConnections;
    mirrors;
    passedPapers;
    
    constructor() {
        this.name = "";
        this.password = "";
        this.bigScreenConnections = new Set();
        this.chatConnections = new Set();
        this.mirrors = new Set();
        this.passedPapers = [];
    }
}

var listOfJCCs = {
    // Filled at runtime ig
};

const randomCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";

function createSalt() {
    var building = "";
    for(var i = 0; i < 20; i++) {
        building += randomCharacters[Math.floor(Math.random() * (randomCharacters.length))];
    }
    return building;
}

app.get('/', (req, res, next) => {
    if(req.useragent.isMobile && !req.url.includes("?nomobile")) {
        res.redirect("/mobile");
    } else {
        res.sendFile("index.html", {root: usableDirname});
    }
});
app.get('/mirror', (req, res, next) => {
    res.sendFile("index.html", {root: usableDirname});
});
app.get('/clock', (req, res, next) => {
    res.sendFile("index.html", {root: usableDirname});
});

app.get("/mobile", (req, res, next) => {
    res.sendFile("index.html", {root: usableDirname});
});

app.get('/worker.js', (req, res) => {
    res.sendFile("worker.js", {root: usableDirname});
});

app.get('/style.css', (req, res) => {
    res.type("text/css");
    res.sendFile("style.css", {root: usableDirname});
});

app.get('/mobile-style.css', (req, res) => {
    res.type("text/css");
    res.sendFile("mobile-style.css", {root: usableDirname});
});

app.get("/ComputerModernSerif.ttf", (req, res) => {
    res.sendFile("./fonts/cmunrm.ttf", {root: usableDirname});
});

app.get("/favicon.png", (req, res) => {
    res.sendFile("./favicon.png", {root: __dirname});
});

app.get("/UN-logo.png", (req, res) => {
    res.sendFile("./UN_logo.png", {root: __dirname});
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

/* app.post("/setcountrylist", (req, res) => {
    currentCountryList = req.body;
    res.status(200).send("All good");
});

app.get("/getcountrylist", (req, res) => {
    res.json(currentCountryList);
}); */

/* app.get("/me.png", (req, res) => {
    res.type("image/png");
    res.sendFile("./images/me.png", {root : __dirname});
}); */

app.use("/flags", express.static(path.join(__dirname, "images/flags")));

app.get("/chat", (req, res) => {
    res.sendFile("./chat.html", {root : __dirname});
});

app.get("/chat.css", (req, res) => {
    res.type("text/css");
    res.sendFile("./chat.css", {root : __dirname});
});

app.get("/chat.js", (req, res) => {
    res.type("text/javascript");
    res.sendFile("./chat.js", {root : __dirname});
});

app.get("/admin", (req, res) => {
    res.sendFile("./admin.html", {root : __dirname});
});

app.post("/adminaccesspoint", jsonParse, (req, res) => {
    if(req.body.code == adminPasswords.viewSaves) {
        res.send(savedSaveData);
    } else if(req.body.code == adminPasswords.resetSaves) {
        savedSaveData = [];
        res.send("All save data deleted");
    } else if(req.body.code == adminPasswords.shutDown) {
		res.send("Shutting down");
        parentShutdownFunction();
    } else {
        res.send("Invalid");
    }
});

app.post("/createJCC", jsonParse, (req, res) => {
    if(typeof req.body == "undefined") {
        res.status(400).send({
            status : 400,
            success: false,
            message: "No message data sent, or it couldn't be found."
        });
        return;
    }
    
    var data = req.body;

    if( !( "name" in data && "password" in data ) ) {
        res.status(400).send({
            status : 400,
            success: false,
            message: "Message data was sent, but it is missing some or all of the required fields."
        });
        return;
    }

    if(listOfJCCs[data.name] != undefined) {
        
        res.status(400).send({
            status : 400,
            success: false,
            message: "JCC with that name already exists."
        });
        return;
    }

    var newJCC = new JCCclass();
    newJCC.name     = data.name;
    newJCC.password = data.password;
    newJCC.salt     = createSalt();

    listOfJCCs[data.name] = newJCC;

    res.status(200).send({
        name    : data.name,
        status  : 200,
        success : true,
        JCCname : newJCC.name,
        salt    : newJCC.salt
    });

    //console.log(listOfJCCs);
});

// app.get("/salt", (req, res) => {
//     res.send(createSalt());
// })

app.post("/jccLogin", (req, res) => {
    if(typeof req.body == "undefined") {
        res.status(400).send({
            status : 400,
            success: false,
            message: "No message data sent, or it couldn't be found."
        });
        return;
    }
    
    var data = req.body;

    if( !( "name" in data && "password" in data ) ) {
        res.status(400).send({
            status : 400,
            success: false,
            message: "Message data was sent, but it is missing some or all of the required fields."
        });
        return;
    }

    if(listOfJCCs[data.name] == undefined) {
        res.status(400).send({
            status : 400,
            success: false,
            message: "No JCC with that name exists."
        });
        return;
    }

    if(listOfJCCs[data.name].password != data.password) {
        res.status(400).send({
            status : 400,
            success: false,
            message: "Invalid password."
        });
        return;
    }

    res.status(200).send({
        name : data.name,
        salt : listOfJCCs[data.name].salt
    });
})

app.ws('/', function(ws, req) {   

    ws.on("message", (message) => { // No error codes or any of that shit here, just discard invalid inputs
        //console.log(message);
        var d;
        var failed = false;
        try {
            d = JSON.parse(message);
            if(typeof d != "object") failed = true;
        } catch(e) {
            failed = true;
        }
        if(failed || typeof d != "object") return;

        if(!( "name" in d && "type" in d && "salt" in d )) return;

        if(!( d.name in listOfJCCs )) return;

        if(!( listOfJCCs[d.name].salt == d.salt )) return;

        if(d.type == "setup") {
            if(d.clientType == "bigScreen") {
                var s = createSalt();
                listOfJCCs[d.name].bigScreenConnections.add(new BigScreen(ws, s));
                ws.send(JSON.stringify({type : "returnSalt", salt : s}));
            } else if(d.clientType == "chatScreen") {
                listOfJCCs[d.name].chatConnections.add(ws);
            } else if(d.clientType == "mirror") {
                listOfJCCs[d.name].mirrors.add(ws);
                ws.send("Connected");
            }
        }
        if(d.type == "paperPassed") {
            var newPaper = new PassedPaper();
            newPaper.name = d.messageBody;
            newPaper.committeeName = d.sender;

            listOfJCCs[d.name].passedPapers.push(newPaper);
        }
        if(d.type == "message" || d.type == "paperPassed") {
            //console.log(d.messageBody);
            listOfJCCs[d.name].bigScreenConnections.forEach((el) => {
                if(el.ws == undefined || el.ws.readyState == ws.CLOSED) listOfJCCs[d.name].bigScreenConnections.delete(el);
            });
            listOfJCCs[d.name].chatConnections.forEach((el) => {
                if(el.readyState == ws.CLOSED) listOfJCCs[d.name].chatConnections.delete(el);
            });

            listOfJCCs[d.name].bigScreenConnections.forEach(function(ws2) {
                if(ws != ws2) ws2.ws.send(JSON.stringify(d));
            });
            listOfJCCs[d.name].chatConnections.forEach(function(ws2) {
                if(ws != ws2) ws2.send(JSON.stringify(d));
            });
        }
        if(d.type == "sendMirror") {
            listOfJCCs[d.name].mirrors.forEach((el) => {
                if(el.readyState == ws.CLOSED) listOfJCCs[d.name].mirrors.delete(el);
            });

            listOfJCCs[d.name].mirrors.forEach(function(ws2) {
                if(ws != ws2) ws2.send(JSON.stringify(d));
            });
        }
        if(d.type == "requestMirrors") {
            Array.from(listOfJCCs[d.name].bigScreenConnections).forEach((el) => {
                if(el.ws == undefined || el.ws.readyState == ws.CLOSED) {
                    listOfJCCs[d.name].bigScreenConnections.delete(el);
                }
            });

            // console.log(listOfJCCs[d.name]);

            listOfJCCs[d.name].bigScreenConnections.forEach(function(ws2) {
                ws2.ws.send(JSON.stringify(d));
            });
        }
    })
})

app.post("/savesavedata", jsonParse, (req, res) => {
    if(req.body.id in savedSaveData) {
        savedSaveData[req.body.id] = req.body.data;

        res.send(JSON.stringify({
            success : true,
            code    : 201,
            message : "Save data successfully stored, overwriting a previous entry"
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

// app.listen(3000, () => {
// 	console.log(`MunWS is listening on port ${3000}`);
// });

module.exports.app = app;

module.exports.startUpFunction = function() {
    if(fs.existsSync("./saves/mun_save_data.txt")) {
        var d = fs.readFileSync("./saves/mun_save_data.txt", "utf-8");

        savedSaveData = JSON.parse(d);
    }
    if(fs.existsSync("./mun/admin_passwords.json")) {
        var d = fs.readFileSync("./mun/admin_passwords.json", "utf-8");

        adminPasswords = JSON.parse(d);
    } else {
        console.warn("Could not find MUN PW Log!!!");
    }
}

module.exports.shutDownFunction = function() {
    console.log("Shutting down MUN...");

    let d = JSON.stringify(savedSaveData);
    fs.writeFileSync("./saves/mun_save_data.txt", d, "utf-8", (error) => {
        if(error) console.log(error);
    });
}

module.exports.setParentShutdownCallback = function(call) {
    parentShutdownFunction = call;
}
