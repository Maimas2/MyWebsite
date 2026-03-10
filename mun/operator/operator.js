// Licensed under GPLv3
// Holy hell this might be the worst code I have ever written
// I apologize to future me. Dated, 9 Mar. 2026

var ws;

var jccData;

var wsUrl;

var peopleMessageAppendingTo = null;

var watchingSalt1 = null;
var watchingSalt2 = null;

var seenSalts1 = [];
var seenSalts2 = [];

function createMessageRaw(type, sender, body, isFromSelf=false) {
    var toAdd = $("<div>").addClass("outlineddiv").css("padding", "15px");

    if(type == "message") {
        if(isFromSelf) {
            toAdd.css("text-align", "right");
            toAdd.css("background-color", "color-mix(in srgb, powderblue 50%, white 50%)");
            toAdd.css("border-radius", "20px 20px 3px 20px");
        } else {
            toAdd.css("border-radius", "20px 20px 20px 3px");
        }

        toAdd.append($("<p>").text(sender).css("font-weight", "bold"));
        toAdd.append($("<p>").text(body));
    } else if(type.startsWith("paperPassed")) {
        toAdd.css("background-color", "#cccccc");

        if(type == "paperPassed") {
            toAdd.append($("<p>").text(sender + " passed a paper:").css("font-weight", "bold"));
        } else if(type == "paperPassedNot") {
            toAdd.append($("<p>").text(sender).css("font-weight", "bold"));
        }

        toAdd.append($("<p>").text(body));
        toAdd.css("text-align", "center");
    }

    $("#chatMessageContainer").append(toAdd);

    $("#chatMessageContainer").animate({
        scrollTop : $("#chatMessageContainer div:last").offset().top
    }, 300);

    return toAdd;
}

function createMessage(data, isFromSelf=false) {
    createMessageRaw(data.type, data.sender, data.messageBody, isFromSelf);
}

window.onload = function() {
    wsUrl = window.location.toString().includes("localhost") ? "ws://localhost:3011/rss" : "wss://" + window.location.host + "/rss";
    $("#join").on("click", function(_e) {
        var d = {
            name     : $("#jccName").val(),
            password : $("#jccPassword").val()
        };
        $("#joinJcc").css("display", "none");
        $.ajax({
            type    : "POST",
            url     : "/jccLogin",
            contentType: 'application/json',
            success : function(returned) {
                console.log(returned);

                setupJccData(returned);
            },
            error   : function(returned) {
                console.error(JSON.parse(returned.responseText));
                $("#joinJcc").css("display", "");
            },
            data    : JSON.stringify(d)
        });
    });
    $("#sendMessageButton").on("click", function(_e) {
        if($("#newMessageType").val().replaceAll(" ", "") == "") return;
        if($("#newMessageType").val().trim() == "!people") {
            peopleMessageAppendingTo = createMessageRaw("paperPassedNot", "Devices Connected", "");
            ws.send(JSON.stringify({
                name : jccData.name,
                type : "requestPresence",
                salt : jccData.salt,
            }));
            $("#newMessageType").val("");
        } else {
            var d = {
                name       : jccData.name,
                type       : "message",
                salt       : jccData.salt,
                messageBody: $("#newMessageType").val(),
                sender     : $("#yourNameInput").val()
            };
            ws.send(JSON.stringify(d));
            createMessage(d, true);
            $("#newMessageType").val("");
        }
    });
}

String.prototype.toTitleCase = function() {
    return this.split(" ").map(s => s[0].toUpperCase() + s.substring(1)).join(" ");
}

const motFancy = {
    "mod" : "In a mod",
    "unmod" : "In an unmod",
    "roundRobin" : "In a round robin",
    "speakersList" : "In the speakers list",
    "presentPapers" : "Presenting papers"
}

function setupJccData(data) {
    jccData = data;

    $("#joinedJcc").css("display", "flex");

    ws = new WebSocket(wsUrl, "echo-protocol");
    
    ws.onopen = function(_e) {
        ws.send(JSON.stringify({
            name       : data.name,
            type       : "setup",
            salt       : data.salt,
            clientType : "operator"
        }));
        $("#jccInfo").css("display", "inline-block");
    };
    ws.addEventListener("message", function(m) {
        console.log(m.data);
        if(m.data == "Connected") {
            ws.send(JSON.stringify({
                name       : data.name,
                type       : "requestMirrors",
                salt       : data.salt
            }));
        } else {
            var d = JSON.parse(m.data);
            if(d.type == "message") {
                createMessage(JSON.parse(m.data));
            } else if(d.type == "paperPassed") {
                m.data.messageBody += " please help me they trapped me in a";
                createMessage(JSON.parse(m.data));
            } else if(d.type == "requestPresence") {
                ws.send(JSON.stringify({
                    type : "sendingName",
                    name : `${$("#yourNameInput").text() || "[No Name]"} – Chat Window`
                }));
            } else if(d.type == "sendingName") {
                if(peopleMessageAppendingTo == null) {
                    
                } else {
                    peopleMessageAppendingTo.append($("<p>").text(data.name));
                }
            } else if(d.type == "sendMirror") {
                if(d.state.mySalt == watchingSalt1) {
                    let dd = d.state;

                    let numPresent = 0;
                    Object.keys(dd.attendance).forEach((k) => {
                        if(dd.attendance[k] && dd.attendance[k] != "Ab") numPresent++;
                    });

                    $("#watcherName1").text(dd.committeeName);
                    $("#watcherCount1").text(`${numPresent} Delegates`);

                    if(dd.isThereACurrentMotion) {
                        if(dd.motionType == "custom") {
                            $("#watcherDetails1").text(dd.currentMotion.fancyMotionType);
                        } else {
                            $("#watcherDetails1").text(motFancy[dd.currentMotion.motionType]);
                        }
                        $("#watcherTime1").text(durationToString(Number(dd.currentMotion.currentTime)));
                    } else {
                        $("#watcherDetails1").text(`Proposing motions, ${dd.proposedMotions.length} so far`);
                        if(dd.isImpromptuTimerOpen) {
                            $("#watcherTime1").text("Impromptu timer: " + durationToString(Number(dd.impromptuTime)));
                        } else {
                            $("#watcherTime1").text("--:--")
                        }
                    }
                } else if(d.state.mySalt == watchingSalt2) {
                    let dd = d.state;

                    let numPresent = 0;
                    Object.keys(dd.attendance).forEach((k) => {
                        if(dd.attendance[k] && dd.attendance[k] != "Ab") numPresent++;
                    });

                    $("#watcherName2").text(dd.committeeName);
                    $("#watcherCount2").text(`${numPresent} Delegates`);

                    if(dd.isThereACurrentMotion) {
                        if(dd.motionType == "custom") {
                            $("#watcherDetails2").text(dd.currentMotion.fancyMotionType);
                        } else {
                            $("#watcherDetails2").text(motFancy[dd.currentMotion.motionType]);
                        }
                        $("#watcherTime2").text(durationToString(Number(dd.currentMotion.currentTime)));
                    } else {
                        $("#watcherDetails2").text(`Proposing motions, ${dd.proposedMotions.length} so far`);
                        if(dd.isImpromptuTimerOpen) {
                            $("#watcherTime2").text("Impromptu timer: " + durationToString(Number(dd.impromptuTime)));
                        } else {
                            $("#watcherTime2").text("--:--")
                        }
                    }
                } else {
                    if(!seenSalts1.includes(d.state.mySalt)) {
                        $("#joinerButtons1").append($("<button>").addClass("paddingButton").text(d.state.committeeName).on("click", function() {
                            $("#joiner1").css("display", "none");
                            $("#watcher1").css("display", "flex");
    
                            watchingSalt1 = d.state.mySalt;

                            ws.send(JSON.stringify({
                                name       : jccData.name,
                                salt       : jccData.salt,
                                type       : "requestMirrors"
                            }));
                        }));
                        seenSalts1.push(d.state.mySalt);
                    }
                    if(!seenSalts2.includes(d.state.mySalt)) {
                        $("#joinerButtons2").append($("<button>").addClass("paddingButton").text(d.state.committeeName).on("click", function() {
                            $("#joiner2").css("display", "none");
                            $("#watcher2").css("display", "flex");
    
                            watchingSalt2 = d.state.mySalt;

                            ws.send(JSON.stringify({
                                name       : jccData.name,
                                salt       : jccData.salt,
                                type       : "requestMirrors"
                            }));
                        }));
                        seenSalts2.push(d.state.mySalt);
                    }
                }
            }
        }
    });
}

$("#quit1").on("click", function(_e) {
    $("#joiner1").css("display", "flex");
    $("#watcher1").css("display", "none");

    $("#joinerButtons1").children().remove();

    seenSalts1 = [];
    watchingSalt1 = null;

    ws.send(JSON.stringify({
        name       : jccData.name,
        salt       : jccData.salt,
        type       : "requestMirrors"
    }));
});

$("#quit2").on("click", function(_e) {
    $("#joiner2").css("display", "flex");
    $("#watcher2").css("display", "none");

    $("#joinerButtons2").children().remove();

    seenSalts2 = [];
    watchingSalt2 = null;

    ws.send(JSON.stringify({
        name       : jccData.name,
        salt       : jccData.salt,
        type       : "requestMirrors"
    }));
});

$(".refreshButton").on("click", function() {
    ws.send(JSON.stringify({
        name       : jccData.name,
        salt       : jccData.salt,
        type       : "requestMirrors"
    }));
});

function durationToString(n) {
    return Math.floor(n/60) + ":" + (n%60 < 10 ? "0" : "") + (n%60);
}

document.onkeydown = function(event) {
    if(ws) {
        if(event.key == "Enter") {
            $("#sendMessageButton").click();
        }
    }
}