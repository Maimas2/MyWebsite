const express    = require('express');
const bodyParser = require("body-parser");

const app = express();

const ws         = require("express-ws")(app);

var jsonParse = bodyParser.json();
app.use(express.json());

class VoteGroup {
	name;
	salt;
	currentMotion;
	voters = [
		"p1",
		"p2",
		"p3",
		"p4",
		"p5",
		"p6",
		"p67",
		"p678",
		"p6789",
		"p67890",
		"a1",
		"a2",
		"a3",
		"a4",
		"a5",
		"a6",
		"a7",
		"a8",
		"a9",
		"a91",
	];
	votes = {
		"p1" : "",
		"p2" : "",
		"p3" : "",
		"p4" : "",
		"p5" : "",
		"p6" : "",
		"p67" : "",
		"p678" : "",
		"p6789" : "",
		"p67890" : "",
		"a1" : "",
		"a2" : "",
		"a3" : "",
		"a4" : "",
		"a5" : "",
		"a6" : "",
		"a7" : "",
		"a8" : "",
		"a9" : "",
		"a91" : ""
	};
	websockets = [

	]
}

var listOfVotingGroups = {
	
}

const randomCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";

function createSalt() {
    var building = "";
    for(var i = 0; i < 20; i++) {
        building += randomCharacters[Math.floor(Math.random() * (randomCharacters.length))];
    }
    return building;
}

const port = 3000;

app.get('/', (req, res) => {
	res.sendFile('index.html', {root: __dirname})
});

app.get('/style.css', (req, res) => {
	res.sendFile('style.css', {root: __dirname})
});

app.get('/vote.js', (req, res) => {
	res.sendFile('vote.js', {root: __dirname})
});

app.get('/admin', (req, res) => {
	res.sendFile('admin.html', {root: __dirname})
});

app.get('/admin.css', (req, res) => {
	res.sendFile('admin.css', {root: __dirname})
});

app.get('/admin.js', (req, res) => {
	res.sendFile('admin.js', {root: __dirname})
});

app.get("/ComputerModernSerif.ttf", (req, res) => {
    res.sendFile("./fonts/cmunrm.ttf", {root: __dirname});
});

app.ws("/ws", (ws, res) => {
	ws.on("message", (message) => {
		console.log(message);
		let m;
		try {
			m = JSON.parse(message);
		} catch(e) {
			return;
		}

		if(!("type" in m) || !("voteName" in m)) return;

		if(m.type == "setup") {
			if(listOfVotingGroups[m.voteName]) {
				listOfVotingGroups[m.voteName].websockets.push(ws);
			}
		} else if(m.type == "requestVotes") {
			ws.send(JSON.stringify({
				type : "sentVotes",
				votes : listOfVotingGroups[m.voteName].votes
			}));
		} else if(m.type == "sentVote") {
			listOfVotingGroups[m.voteName].votes[m.person] = m.vote;
		} else if(m.type == "newMotion") {
			listOfVotingGroups[m.voteName].currentMotion = m.newMotion;
			listOfVotingGroups[m.voteName].websockets.forEach((wss) => {
				if(ws == wss) return;
				wss.send(JSON.stringify({
					type : "motionUpdate",
					newMotion : m.newMotion
				}));
			});
			Object.keys(listOfVotingGroups[m.voteName].votes).forEach((key) => {
				listOfVotingGroups[m.voteName].votes[key] = "";
			});
		}
	});
});

function sendWsHeartbeat() {
    Object.keys(listOfVotingGroups).forEach((key) => {
        let tvote = listOfVotingGroups[key];
        tvote.websockets.forEach(function(ws) {
            ws.send(JSON.stringify({type : "heartbeat"}));
        });
    })
}

app.post("/getvote", jsonParse, (req, res) => {
	console.log(req.body);

	if(!req.body.voteName) {
		res.status(400).send({message : "No vote name sent!"});
		return;
	}

	if(!listOfVotingGroups[req.body.voteName]) {
		res.status(400).send({message : "Vote not found"});
		return;
	}

	let tvote = listOfVotingGroups[req.body.voteName];

	res.send({
		name : tvote.name,
		//salt : tvote.salt,
		voters : tvote.voters,
		votes : tvote.votes
	});
});

app.post("/deleteperson", jsonParse, (req, res) => {
	if(!listOfVotingGroups[req.body.voteName]) {
		res.status(404).send({error : "Could not find vote"});
		return;
	}
	let tvote = listOfVotingGroups[req.body.voteName];

	delete tvote.votes[req.body.person];
	tvote.voters.splice(tvote.voters.find(req.body.person), 1);
	res.send({message : `Deleted ${req.body.person}`});
});

app.post("/login", jsonParse, (req, res) => {
	/* req.body = {
		name : name of voting person eg. Mark,
		voteName : name of the vote, eg. "Waterford MUN March 2025 conference"
	} */
	if(!listOfVotingGroups[req.body.voteName]) {
		res.status(404).send({message : "Could not find vote"});
		return;
	}
	let tvote = listOfVotingGroups[req.body.voteName];
	if(!tvote.voters.includes(req.body.name)) {
		tvote.voters.push(req.body.name);
		tvote.votes[req.body.name] = "";
	}

	res.send({
		cmt : tvote.currentMotion, // current motion topic
		currentVote : tvote.votes[req.body.name]
	});
});

app.get("/getvotes", (req, res) => {
	if(!listOfVotingGroups[req.body.voteName]) {
		res.status(404).send({message : "Could not find vote"});
		return;
	}
	let tvote = listOfVotingGroups[req.body.voteName];
	res.send({votes : tvote.votes});
});

app.post("/createvote", jsonParse, (req, res) => {
	console.log(req.body);
	if(!req.body.voteName) {
		res.status(400).send({message : "Bad CreateVote query. No action taken."});
		return;
	}

	if(listOfVotingGroups[req.body.voteName]) {
		res.status(404).send({error : "Vote already exists"});
		return;
	}
	
	let tvote = new VoteGroup();
	tvote.name = req.body.voteName;
	tvote.salt = createSalt();
	tvote.currentMotion = req.body.currentMotion || "[initial motion]";

	listOfVotingGroups[req.body.voteName] = tvote;

	res.status(200).send(`Vote ${req.body.voteName} successfully created.`);
});

module.exports.app = app;

module.exports.startUpFunction = function() {
    setInterval(sendWsHeartbeat, 5000);
}

module.exports.shutDownFunction = function() {
    // Pass
}
