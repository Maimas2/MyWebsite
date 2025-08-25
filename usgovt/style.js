const {PI, sin, cos, max, min, exp, abs, floor, ceil} = Math

var c = $("#mainCanvas")[0];
var ctx = c.getContext("2d");

window.onresize = function() {
    $("#mainCanvas").css("width", window.innerWidth);
    $("#mainCanvas").prop("width", window.innerWidth);
    $("#mainCanvas").css("height", window.innerHeight);
    $("#mainCanvas").attr("height", window.innerHeight);
}

window.onload = function() {
    window.requestAnimationFrame(draw);

    window.onresize();

    ctx.font = "12pt ComputerModern";

    ctx.save();
}

var boxes = {

}

var usGovt = {
    name     : "US Constitution",
    fullText : "The Constitution is the supreme law of the land in the United States.",
    customWidth : 600,
    sub      : [
        {
            name     : "The Executive Branch",
            fullText : " The president and his appointed officials comprise the executive branch."
        },
        {
            name     : "The Congress",
            fullText : "The Congress comprises the legislative branch, which writes and passes laws."
        },
        {
            name     : "The Judiciary",
            fullText : "The courts review laws and other court cases."
        }
    ]
}

var translation = [0, 0];

var lastMousePosition = [-194, -1];

var dragStartPosition = [-1, -1];

var dragStartBox = undefined;

var scale = 1;

var isDragging = false;

function screenToWorld(x, y) {
    return [(x - translation[0]) / scale, (y - translation[1]) / scale];
}

function worldToScreen(x, y) {
    return [translation[0] + scale * x, translation[1] + scale * y];
}

function updateLastMouse(e) {
    lastMousePosition = [e.clientX - document.getElementById("mainCanvas").getBoundingClientRect().x, e.clientY - document.getElementById("mainCanvas").getBoundingClientRect().y];
}

function getMousedOverBox() {
    for(boxKey in boxes) {
        let box = boxes[boxKey];
        
        var pos = worldToScreen(box.x, box.y);
        var otherCorner = worldToScreen(box.x+box.width, box.y+box.height);

        if(lastMousePosition[0] > pos[0] && lastMousePosition[0] < otherCorner[0] && lastMousePosition[1] > pos[1] && lastMousePosition[1] < otherCorner[1]) {
            console.log(box.text);
            return box.text;
        }
    }
    return undefined;
}

window.onmousedown = function(e) {
    isDragging = true;
    updateLastMouse(e);
    dragStartPosition = lastMousePosition;

    dragStartBox = getMousedOverBox();
};

window.onmouseup = function(e) {
    isDragging = false;
    updateLastMouse(e)

    var dragEndBox = getMousedOverBox();
    if(dragEndBox != undefined && dragEndBox == dragStartBox) {
        if(abs(dragStartPosition[0] - lastMousePosition[0]) < 10 && abs(dragStartPosition[1] - lastMousePosition[1]) < 10) {
            $("#pdesc").text(boxes[dragEndBox].fullText);
        }
    }
};

window.addEventListener("wheel", function(e) {
    var mp = [e.clientX - document.getElementById("mainCanvas").getBoundingClientRect().x, e.clientY - document.getElementById("mainCanvas").getBoundingClientRect().y];
    var oldScale = scale;

    if(e.wheelDelta > 0) {
        scale *= 1.1;
    } else {
        scale /= 1.1;
    }

    translation[0] = mp[0] - scale * (mp[0] - translation[0]) / oldScale;
    translation[1] = mp[1] - scale * (mp[1] - translation[1]) / oldScale;
});

window.onmousemove = function(e) {
    if(isDragging) {
        if(lastMousePosition[0] == -194) lastMousePosition = [e.clientX, e.clientY];

        translation[0] -= (lastMousePosition[0] - (e.clientX - document.getElementById("mainCanvas").getBoundingClientRect().x)); // Whoops messed up the signs
        translation[1] -= (lastMousePosition[1] - (e.clientY - document.getElementById("mainCanvas").getBoundingClientRect().y));

        lastMousePosition = [e.clientX - document.getElementById("mainCanvas").getBoundingClientRect().x, e.clientY - document.getElementById("mainCanvas").getBoundingClientRect().y];
    }
}

function borderedRoundRect(x, y, width, height) {
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, 15);
    ctx.fill();

    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.beginPath();
    ctx.roundRect(x+1.5, y+1.5, width-3, height-3, 15 * ((width-3)/width));
    ctx.fill();
}

function drawCenteredText(str, x, y) {
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.font = "12pt ComputerModern";
    ctx.fillText(str, x - ctx.measureText(str).width/2, y);
}

function boxWithText(x, y, width, height, text) {
    if(boxes[text] == undefined) {
        boxes[text] = {
            x : x,
            y : y,
            width : width,
            height : height,
            text : text,
            fullText : "The Full text of the US constitution"
        }
    }

    borderedRoundRect(x, y, width, height);
    drawCenteredText(text, x+width/2, y+height/2);
}

function drawGovt(govt) {
    
}

function draw() {
    ctx.restore();

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    ctx.save();

    ctx.setTransform(scale, 0, 0, scale, translation[0], translation[1]);

    drawGovt(usGovt);

    window.requestAnimationFrame(draw);
}