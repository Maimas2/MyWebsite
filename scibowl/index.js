const express    = require('express');
const bodyParser = require("body-parser");

const app = express();

const ews        = require("express-ws")(app);

app.use(express.json());

class RoomClass {
    salt; // Internal password sorta thing idk
    name;
    password;
    projecting;
    mirrors;
    
    constructor() {
        this.name = "";
        this.password = "";
        this.projecting = null;
        this.mirrors = new Set();
    }
}

var listOfRooms = {
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

app.get('/', (req, res) => {
	res.sendFile('index.html', {root: __dirname})
});

app.get('/style.css', (req, res) => {
	res.sendFile('style.css', {root: __dirname})
});

app.get('/scibowl.js', (req, res) => {
	res.sendFile('scibowl.js', {root: __dirname})
});

app.get("/ComputerModernSerif.ttf", (req, res) => {
    res.sendFile("./fonts/cmunrm.ttf", {root: __dirname});
});

app.post("/createRoom", bodyParser, (req, res) => {
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

    if(listOfRooms[data.name] != undefined) {
        
        res.status(400).send({
            status : 400,
            success: false,
            message: "Room with that name already exists."
        });
        return;
    }

    var newRoom = new RoomClass();
    newRoom.name     = data.name;
    newRoom.password = data.password;
    newRoom.salt     = createSalt();

    listOfRooms[data.name] = newRoom;

    res.status(200).send({
        name    : data.name,
        status  : 200,
        success : true,
        JCCname : newRoom.name,
        salt    : newRoom.salt
    });
});

app.post("/roomLogin", (req, res) => {
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

    if(listOfRooms[data.name] == undefined) {
        res.status(400).send({
            status : 400,
            success: false,
            message: "No room with that name exists."
        });
        return;
    }

    if(listOfRooms[data.name].password != data.password) {
        res.status(400).send({
            status : 400,
            success: false,
            message: "Invalid password."
        });
        return;
    }

    res.status(200).send({
        name : data.name,
        salt : listOfRooms[data.name].salt
    });
})

app.ws('/rss', function(ws, req) {   

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
            if(d.clientType == "projecting") {
                if(listOfRooms[d.name].projecting != null) return;
                var s = createSalt();
                listOfRooms[d.name].projecting = ws;
                ws.send(JSON.stringify({type : "returnSalt", salt : s}));
            } else if(d.clientType == "mirror") {
                listOfRooms[d.name].mirrors.add(ws);
                ws.send("Connected");
            }
        }
        if(d.type == "message") { // Can only be from the projecting screen
            listOfRooms[d.name].mirrors.forEach((el) => {
                if(el.readyState == ws.CLOSED) listOfRooms[d.name].mirrors.delete(el);
            });

            listOfRooms[d.name].mirrors.forEach(function(ws2) {
                if(ws != ws2) ws2.ws.send(JSON.stringify(d));
            });
        }
    })
})

function sendWsHeartbeat() {
    Object.keys(listOfRooms).forEach((roomKey) => {
        let room = listOfRooms[roomKey];

        room.projecting.send(JSON.stringify({type : "heartbeat"}));

        room.mirrors.forEach(function(conn) {
            conn.send(JSON.stringify({type : "heartbeat"}));
        });
    });
}

module.exports.app = app;

module.exports.startUpFunction = function() {
    setInterval(sendWsHeartbeat, 5000);
}

module.exports.shutDownFunction = function() {
    // Pass
}
