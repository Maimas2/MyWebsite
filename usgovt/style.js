const {PI, sin, cos, max, min, exp, abs, floor, ceil} = Math

var c = $("#mainCanvas")[0];
var ctx = c.getContext("2d");

window.onresize = function() {
    $("#mainCanvas").css("width", window.innerWidth);
    $("#mainCanvas").prop("width", window.innerWidth);
    $("#mainCanvas").css("height", window.innerHeight);
    $("#mainCanvas").attr("height", window.innerHeight);

    window.requestAnimationFrame(draw);
}

window.onload = function() {
    window.requestAnimationFrame(draw);

    window.onresize();

    ctx.font = "12pt ComputerModern";

    ctx.save();

    buildGovt(usGovt, 100, 100, 0);
}

var boxes = {

}

var lines = [

]

var usGovt = {
    name     : "US Constitution",
    fullText : "The Constitution is the supreme law of the land in the United States.",
    customWidth : 600,
    sub      : [
        {
            name     : "The Executive Branch",
            fullText : "The president and his appointed officials enforce the laws of the nation.",
            sub      : [
                {
                    name     : "The President",
                    fullText : "The President is the chief executive of the government and runs much of it.",
                    sub      : [
                        {
                            name     : "Independent Agencies",
                            fullText : "Not considered full departments, independent agencies have a specific topic to regulate, but the president has less control over them. They do not have a representative in the Cabinet."
                        },
                        {
                            name     : "The Executive Departments",
                            fullText : "The executive departments each help with one area of policy, whether enforcing laws or creating regulations. The Secretaries of the departments compose the Cabinet.",
                            sub      : [
                                {
                                    name     : "Department of State",
                                    fullText : "The Department of State manages foreign policy."
                                },
                                {
                                    name     : "Department of the Treasury",
                                    fullText : "The Department of the Treasury manages the nation's financials."
                                },
                                {
                                    name     : "Department of the Interior",
                                    fullText : "The Department of the Interior manages much of the federal land and its resources in the nation."
                                },
                                {
                                    name     : "Department of Agriculture",
                                    fullText : "The Department of Agriculture supports agriculture, livestock, and related industries."
                                },
                                {
                                    name     : "Department of Justice",
                                    fullText : "The Department of Justice oversees law enforcement."
                                },
                                {
                                    name     : "Department of Commerce",
                                    fullText : "The Department of Commerce gathers data on the nation's industry."
                                },
                                {
                                    name     : "Department of Labor",
                                    fullText : "The Department of Labor enforces federal laws relating to labor and workplaces."
                                },
                                {
                                    name     : "Department of Defence",
                                    fullText : "The Department of Defence runs the military."
                                },
                                {
                                    name     : "Department of Health and Human Services",
                                    fullText : "The Department of Health and Human Services supports the people's personal health."
                                },
                                {
                                    name     : "Department of Housing and Urban Development",
                                    fullText : "The Department of Housing and Urban Development helps enforce laws relating to urban areas and housing."
                                },
                                {
                                    name     : "Department of Transportation",
                                    fullText : "The Department of Transportation regulates the nation's transportation."
                                },
                                {
                                    name     : "Department of Energy",
                                    fullText : "The Department of Energy oversees the nation's energy production and power plants."
                                },
                                {
                                    name     : "Department of Education",
                                    fullText : "The Department of Education regulates and supports (supported?) the nation's schools at all levels."
                                },
                                {
                                    name     : "Department of Veterans' Affairs",
                                    fullText : "The Department of Veterans' Affairs provides healthcare to veterans."
                                },
                                {
                                    name     : "Department of Homeland Security",
                                    fullText : "The Department of Homeland Security secures and protects the nation's land."
                                },
                            ]
                        },
                        {
                            name     : "Executive Office of the President",
                            fullText : "The Executive Office of the President directly supports the president's day-to-day operations."
                        }
                    ]
                }
            ]
        },
        {
            name     : "The Congress",
            fullText : "The Congress comprises the legislative branch, which writes and passes laws.",
            sub      : [
                {
                    name     : "The House of Representatives",
                    fullText : "The lower chamber of the Congress represents the peoples' interests."
                },
                {
                    name     : "The Senate",
                    fullText : "The upper chamber of the Congress represents the states' interests."
                }
            ]
        },
        {
            name     : "The Judiciary",
            fullText : "The courts review laws and other court cases.",
            sub      : [
                {
                    name     : "The Supreme Court",
                    fullText : "The Supreme Court has nationwide jurisdiction and hears both appellate cases and cases involving different states.",
                    sub      : [
                        {
                            name     : "Appeals Courts",
                            fullText : "The appeals courts hear appeals cases from the district courts.",
                            sub      : [
                                {
                                    name     : "District Courts",
                                    fullText : "The district courts are the first to hear cases involving federal laws."
                                }
                            ]
                        }
                    ]
                }
            ]
        } 
    ]
}

var translation = [0, 0];

var lastMousePosition = [-194, -1];

var dragStartPosition = [-1, -1];

var dragStartBox = undefined;
var currentSelectedBox = "vbyugtkrmfnvbghj";
var scale = 1;

var isDragging = false;

const maxChildenWidth = 5;

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
    console.log(dragEndBox);
    if(dragEndBox != undefined && dragEndBox == dragStartBox) {
        if(abs(dragStartPosition[0] - lastMousePosition[0]) < 10 && abs(dragStartPosition[1] - lastMousePosition[1]) < 10) {
            $("#pdesc").text(boxes[dragEndBox].fullText);
            currentSelectedBox = boxes[dragEndBox].text;
        }
    } else {
        currentSelectedBox = "vbyugtkrmfnvbghj"
    }
    window.requestAnimationFrame(draw);
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

    window.requestAnimationFrame(draw);
});

window.onmousemove = function(e) {
    if(isDragging) {
        if(lastMousePosition[0] == -194) lastMousePosition = [e.clientX, e.clientY];

        translation[0] -= (lastMousePosition[0] - (e.clientX - document.getElementById("mainCanvas").getBoundingClientRect().x)); // Whoops messed up the signs
        translation[1] -= (lastMousePosition[1] - (e.clientY - document.getElementById("mainCanvas").getBoundingClientRect().y));

        lastMousePosition = [e.clientX - document.getElementById("mainCanvas").getBoundingClientRect().x, e.clientY - document.getElementById("mainCanvas").getBoundingClientRect().y];

        window.requestAnimationFrame(draw);
    }
}

function borderedRoundRect(x, y, width, height, border = "rgb(0, 0, 0)") {
    ctx.fillStyle = border;
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, 15);
    ctx.fill();

    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.beginPath();
    ctx.roundRect(x+1.5, y+1.5, width-3, height-3, 15 * ((width-3)/width));
    ctx.fill();
}

function drawCenteredText(str, x, y, maxWidth = undefined) {
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.font = "12pt ComputerModern";
    ctx.fillText(str, x - min(ctx.measureText(str).width/2, (maxWidth || 100000) / 2), y, maxWidth || Infinity);
}

function boxWithText(x, y, width, height, text) {
    if(text == currentSelectedBox) {
        borderedRoundRect(x, y, width, height, "rgb(255, 0, 0)");
    } else {
        borderedRoundRect(x, y, width, height);
    }
    drawCenteredText(text, x+width/2, y+height/2, 180);
}

function getWidthOfBoxes(thingss, levelDown=0, goDownTo=100) {
    let things = thingss.sub;
    if(things == undefined || !things.length || levelDown == goDownTo) return thingss.customWidth || 200;
    
    var toReturn = 0;
    var num = 0;
    things.forEach((thing) => {
        if(num++ < maxChildenWidth) {
            if(toReturn != 0) toReturn += max(50, 100 - (levelDown)*15);
            toReturn += max(getWidthOfBoxes(thing, levelDown+1), thing.customWidth || 200);
        }
    });
    return toReturn;
}

function buildGovt(govt, x, y, levelDown) { // Inefficient ass function
    if(levelDown == 0) {
        boxes = [  ]
        lines = [  ]
    }

    // if(!govt.customWidth) {
    //     govt.customWidth = max(200, 600 - 300*levelDown)
    // }

    var currentY = y+max(150, 400 - levelDown*75);

    var currentX = x - max(getWidthOfBoxes(govt, levelDown), govt.customWidth || 200)/2;

    if(govt.sub) {
        for(var i = 0; i < govt.sub.length; i++) {
            if(i % maxChildenWidth == 0 && i != 0) {
                currentX = x - getWidthOfBoxes(govt, levelDown)/2;
                currentY += 150;
            }

            let sub = govt.sub[i];

            var tw = max(getWidthOfBoxes(sub, levelDown+1), govt.customWidth || 200);
            
            currentX += tw/2;

            if(levelDown) {
                lines.push([[x + (sub.customWidth || 200)/2, y+100], [currentX + (sub.customWidth || 200)/2, currentY]]);
            } else {
                lines.push([[x + (sub.customWidth || 200)/2, y], [currentX + (sub.customWidth || 200)/2, currentY]]);
            }

            buildGovt(sub, currentX, currentY, levelDown+1);

            currentX += tw/2 + max(50, 100 - (levelDown)*15);
            //if(i % maxChildenWidth) currentX += max(50, 100 - (levelDown)*15);
        }
    }

    boxes[govt.name] = {
        x : x - (govt.customWidth || 200)/2 + 100,
        y : y,
        width : govt.customWidth || 200,
        height : 100,
        text : govt.name,
        fullText : govt.fullText,
        levelDown : levelDown
    }

    if(levelDown == 0) {
        boxes["About this Site"] = {
            x : -200,
            y : -200,
            width : 200,
            height : 100,
            text : "About this Site",
            fullText : "This site was made as a quick passion project in about three days. The algorithms are not particularly good. But, if anyone at any points find even the smallest bit of use from this, I'll consider it a success. It ended up as just a 'structure of the Executive branch,' but oh well.",
            levelDown : -1
        }
    }
}

function drawCurrentGovt() {
    lines.forEach((line) => {
        ctx.beginPath();
        ctx.moveTo(line[0][0], line[0][1]);
        ctx.lineTo(line[1][0], line[1][1]);
        ctx.stroke();
    });
    Object.keys(boxes).forEach((box) => {
        boxWithText(boxes[box].x, boxes[box].y, boxes[box].width, boxes[box].height, boxes[box].text);
    });
}

function draw() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    ctx.save();

    ctx.setTransform(scale, 0, 0, scale, translation[0], translation[1]);

    var start = performance.now();

    drawCurrentGovt()

    var end = performance.now();

    ctx.restore();

    ctx.fillText(`Rendered in ${end - start}ms`, 10, 15);
}