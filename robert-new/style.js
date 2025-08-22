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

    drawPerson(sW/2, 0, 0, 0, colorOverride = "rgb(128, 128, 128)");

    ctx.font = "45px ComputerModern";
    ctx.fillStyle = "rgb(0, 0, 0)"
    ctx.fillText("Chair", sW/2-50, 115);

    for(var i = 0; i <= PI/2; i += PI/2) {
        drawPerson(cos(i)*300+sW/2+150, sin(i)*300+100, 2*(sec-startTime)-i/5);
    }
    for(var i = 0; i <= PI/2; i += PI/6) {
        drawPerson(cos(i)*550+sW/2+150, sin(i)*550+100, 2*(sec-startTime)-i/5-0.25);
    }
    for(var i = 0; i <= PI/2; i += PI/6) {
        drawPerson(cos(i)*775+sW/2+150, sin(i)*775+100, 2*(sec-startTime)-i/5-0.5);
    }

    for(var i = 0; i <= PI/2; i += PI/2) {
        drawPerson(cos(PI-i)*300+sW/2-150, sin(PI-i)*300+100, 0);
    }
    for(var i = 0; i <= PI/2; i += PI/6) {
        drawPerson(cos(PI-i)*550+sW/2-150, sin(PI-i)*550+100, 0);
    }
    for(var i = 0; i <= PI/2; i += PI/6) {
        drawPerson(cos(PI-i)*775+sW/2-150, sin(PI-i)*775+100, 0);
    }

    window.requestAnimationFrame(draw);
}