const express = require('express');
const fs      = require('fs');
const app     = express();
const ews     = require("express-ws")(app);

const port = 3000;

const maxIds = 1000;

var currentId = 0;

var unsortedclients = new Set();

var idconnections = new Array(maxIds);

var questionList;

// You should refactor to multiple lists of connections: operator, timer, player

app.ws('connection', (ws, req) => {
  // Add the new client to the set
	unsortedclients.add(ws);

	ws.on('message', (message) => {
		console.log(message);
      if(!isNaN(message.toString())) {
        idconnections[Number(message.toString())].add(ws);
        unsortedclients.delete(ws);
      } else {
        let data = JSON.parse(message.toString());
		
        var idUsed = Number(data.id);
        if(idUsed != -1) {
          idconnections[idUsed].forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message.toString());
            }
          });
        }
      }
	});

	ws.on('close', () => {
		idconnections.forEach(client => {
			if(client.has(ws)) client.delete(ws);
		});
	});
});

app.get('/', (req, res) => {
	res.sendFile('index.html', {root: __dirname})
});

app.get('/timer', (req, res) => {
    res.sendFile('timer.html', {root: __dirname})
})

app.get('/operator', (req, res) => {
    res.sendFile('operator.html', {root: __dirname})
})

app.get('/style.css', (req, res) => {
	res.sendFile('style.css', {root: __dirname})
})

app.get('/buzz_effect', (req, res) => {
	res.sendFile('robo_bell_pressed.mp3', {root: __dirname})
})

var randomProperty = function (obj) {
	var keys = Object.keys(obj);
	return obj[keys[ keys.length * Math.random() << 0]];
};

app.get('/questionviewer', (req, res) => {
	res.sendFile('questionviewer.html', {root: __dirname});
})

app.get('/getquestion', (req, res) => {
	res.send(randomProperty(questionList.questions));
})

// app.get('/testws', (req, res) => {
//   res.sendFile('testws.html', {root: __dirname})
// })

app.get('/getnewid', (req, res) => {
	res.send({ id : currentId });
	currentId++;
	if(currentId >= maxIds) currentId = 0;
});

app.get('/test', (req, res) => {
	res.send('This is a test')
})

app.get('/play', (req, res) => {
	res.sendFile("player.html", {root: __dirname});
});

app.listen(3001, () => {
	console.log(`SciBowlWS is listening on port ${3001}`);
});

module.exports.app = app;

module.exports.startUpFunction = function() {
    for(let i = 0; i < maxIds; i++) {
		idconnections[i] = new Set();
	}
	var tstr = fs.readFileSync("./data/question-list.json").toString();
	questionList = JSON.parse(tstr);
}

module.exports.shutDownFunction = function() {
    // Pass
}
