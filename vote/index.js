const express    = require('express');
const bodyParser = require("body-parser");

const app = express();

var jsonParse = bodyParser.json();
app.use(express.json());

var votes = {
	"Aaron" : "",
	"Alex C" : "",
	"Alex S" : "",
	"Drew" : "",
	"JT" : "",
	"Karl" : "",
	"Oliver" : "",
	"Patrick" : "",
	"Will" : "",
	"Xavier" : ""
}

const port = 3000;

var currentMotionTopic = "Your mom";

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

app.get("/getcurrentmotion", (req, res) => {
	res.send(currentMotionTopic);
});

app.get("/getpeople", (req, res) => {
	res.send({people : Object.keys(votes)});
})

app.post("/setcurrentmotion", jsonParse, (req, res) => {
	currentMotionTopic = req.body.newMotion;
	res.send(`Set new motion to ${req.body.newMotion}`);

	var k = Object.keys(votes);
	for(var i = 0; i < k.length; i++) {
		votes[k[i]] = "";
	}
});

app.post("/submitvote", jsonParse, (req, res) => {
	if(req.body.voteName != currentMotionTopic) {
		res.status(400).send("Outdated motion topic");
		return;
	}

	if(!Object.keys(votes).includes(req.body.person)) {
		res.status(400).send({error:"Person not found!!!!!"});
		return;
	}
	votes[req.body.person] = req.body.vote;
	
	res.send("OK");
});

app.post("/login", jsonParse, (req, res) => {
	if(!Object.keys(votes).includes(req.body.name)) votes[req.body.name] = "";
	res.status(200).send({cmt : currentMotionTopic, pastVote : votes[req.body.name]});
});

app.get("/getvotes", (req, res) => {
	res.send(votes);
});

module.exports.app = app;

module.exports.startUpFunction = function() {
    // Pass
}

module.exports.shutDownFunction = function() {
    // Pass
}
