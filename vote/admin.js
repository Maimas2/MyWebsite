var selected = null;
var currentName = null;

var currentVoteName;
var ws;

var currentVotes = {};

function cleanText(s) {
    return s.replaceAll(" ", "").replaceAll("#", "").replaceAll(".", "");
}

function toColor(s) {
    if(s == "yea") return "#7f7";
    if(s == "nay") return "#f99";
    if(s == "abstain") return "rgb(255, 204, 108)";
    return s;
}

function reloadVotes() {
    if($("#login").length) return;

    ws.send(JSON.stringify({
        type : "requestVotes",
        voteName : currentVoteName
    }));
}

window.onload = function() {
    if(window.screen.height / window.screen.width > 1.25) {
        $("#bottomBar").css("flex-direction", "column");
    }

    $("#setNewMotion").on("click", function(_e) {
        var t = prompt("What's the new vote's name/description?")
        if(t == null) return;
        var d = {
            newMotion : t
        };

        ws.send(JSON.stringify({
            type : "newMotion",
            voteName : currentVoteName,
            newMotion : t
        }));
    });
}

$("#loginButton").on("click", function(_e) {
    let d = {
        voteName : $("#voteNameInput").val()
    }
    currentVoteName = $("#voteNameInput").val();
    $.ajax({
        type    : "POST",
        url     : "/getvote",
        contentType : "application/json",
        success : onLogin,
        error   : function(returned) {
            console.error(returned.responseText);
        },
        data : JSON.stringify(d)
    });
});

function onLogin(returned) {
    console.log(returned);

    ws = new WebSocket("/ws", "echo-protocol");
    ws.onopen = function() {
        $("#login").remove();
        ws.send(JSON.stringify({
            type : "setup",
            voteName : currentVoteName
        }));
        reloadVotes();
    }
    ws.onmessage = (message) => {
        console.log(message.data);

        let m = JSON.parse(message.data);

        if(m.type == "sentVotes") {
            currentVotes = m.votes;
            var keys  = Object.keys(m.votes).sort();

            var toReturn = "";

            var yeas = 0;
            var nays = 0;
            var abstains = 0;

            $("#bottomBar > *").remove();

            for(let i = 0; i < keys.length; i++) {
                if(m.votes[keys[i]] == "yea") yeas++;
                if(m.votes[keys[i]] == "nay") nays++;
                if(m.votes[keys[i]] == "abstain") abstains++;

                //toReturn += keys[i] + ": " + returned[keys[i]] + "<br>";

                $("#bottomBar").append(
                    $("<div>").addClass("outlineddiv").css("width", "30%").css("display", "inline-block").css("padding", "5px").css("margin", "3px").css("background-color", toColor(m.votes[keys[i]])).css("flex-direction", "row").prop("data-name", keys[i]).append(
                        $("<p>").css("display", "inline").text(keys[i])
                    ).on("click", function(_e) {
                        var d = {
                            person : $(this).prop("data-name")
                        }
                        console.log(d);

                        $.ajax({
                            type    : "POST",
                            url     : "/deleteperson",
                            contentType : "application/json",
                            success : function(returned) {
                                console.log(returned);
                            },
                            error   : function(returned) {
                                console.error(returned);
                            },
                            data    : JSON.stringify(d)
                        });

                        reloadVotes();
                    })
                )
            }

            $("#totalPresent").text(`${keys.length} Present`);
            $("#yeas").text(`${yeas} Yeas`);
            $("#nays").text(`${nays} Nays`);
        }
    }

    setInterval(reloadVotes, 2000);
}

$("#createVoteButton").on("click", function() {
    let d = {
        voteName : $("#voteNameInput").val()
    }
    currentVoteName = $("#voteNameInput").val();
    $.ajax({
        type    : "POST",
        url     : "/createvote",
        contentType : "application/json",
        success : onLogin,
        error   : function(returned) {
            console.error(returned.responseText);
        },
        data : JSON.stringify(d)
    });
});

const {PI, sin, cos, max, min, exp, abs, floor, ceil} = Math

var c = $("#mainCanvas")[0];
var ctx = c.getContext("2d");

function drawPerson(x, y, amountRaised=0, disagreeness=-1, colorOverride = "") {
    amountRaised = max(0, min(1, amountRaised))

    x -= 60
    y -= 67.5

    if(disagreeness == -1) disagreeness = 1-amountRaised

    ctx.fillStyle = `rgb(${floor((disagreeness)*200)} ${floor((1-disagreeness)*200)} 0)`;

    if(colorOverride != "") ctx.fillStyle = colorOverride;

    ctx.beginPath();
    ctx.arc(x+60, y+35, 35, 0, 2 * PI);
    ctx.fill();

    ctx.beginPath();
    ctx.roundRect(x, y+75, 120, 60, 15);
    ctx.fill();

    ctx.beginPath();
    ctx.roundRect(x+105, y+105, 25, -90*amountRaised, 5);
    ctx.fill();
}

window.onload = function() {
    window.requestAnimationFrame(draw);

    window.onresize();

    ctx.save();
}

window.onresize = function() {
    $("#mainCanvas").prop("width", $("#mainCanvas").width());
    $("#mainCanvas").attr("height", $("#mainCanvas").height());
}

var isResizing = false;

$("#resizer").on("mousedown", function(_e) {
    isResizing = true
});

window.onmousemove = function(e) {
    if(isResizing) {
        $("#leftSide").css("width", e.clientX-5);
        $("#resizer").css("left", e.clientX-5);
        $("#mainCanvas").css("width", window.innerWidth-e.clientX-5);

        window.onresize();
    }
}

window.onkeydown = function(_e) {
    startTime = getTime()
}

window.onmouseup = function(_e) {
    isResizing = false
}

function getTime() {
    let dat = new Date()
    return dat.getMinutes()*60 + dat.getSeconds() + dat.getMilliseconds()/1000
}

function drawCenteredText(str, x, y) {
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.font = "48px ComputerModern";
    ctx.fillText(str, x - min(ctx.measureText(str).width/2, 100000), y);
}

var startTime = getTime()

function draw() {
    let sec = getTime()

    ctx.restore();

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    ctx.save();

    var s = $("#mainCanvas").width() / 2400

    ctx.scale(s, s);

    var sW = $("#mainCanvas").width()/s
    var sH = $("#mainCanvas").height()/s

    ctx.translate(0, sH/2-550);

    /* drawPerson(sW/2, 0, 0, 0, colorOverride = "rgb(128, 128, 128)");

    ctx.font = "45px ComputerModern";
    ctx.fillStyle = "rgb(0, 0, 0)"
    ctx.fillText("Chair", sW/2-50, 115); */

    ctx.font = "21px ComputerModern";
    ctx.fillStyle = "rgb(0, 0, 0)"

    let numNames = Object.keys(currentVotes).length
    let names    = Object.keys(currentVotes)

    let nname = 0;

    for(var i = 0; i <= PI; i += PI/numNames) {
        drawPerson(cos(PI-i)*775+sW/2-150, sin(PI-i)*775+100, 0);
        drawCenteredText(names[nname], cos(PI-i)*775+sW/2-150, sin(PI-i)*775+300);

        nname++;
    }

    window.requestAnimationFrame(draw);
}