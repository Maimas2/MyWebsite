// Licensed under GPLv3

var ws;

var jccData;

var wsUrl;

var peopleMessageAppendingTo = null;
var typeOfPresenseRequest = 0;
/* 0 : print names and types of screen
 * 1 : print names and salts
 */

var areSoundsDisabled = false;

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

    $("#chatMessageContainer").prepend(toAdd);

    // $("#chatMessageContainer").animate({
    //     scrollTop : $("#chatMessageContainer div:last").offset().top
    // }, 300);

    if(!isFromSelf && !areSoundsDisabled) {
        $("#notificationSound")[0].fastSeek(0);
        $("#notificationSound")[0].play();
    }

    return toAdd;
}

function createMessage(data, isFromSelf=false) {
    createMessageRaw(data.type, data.sender, data.messageBody, isFromSelf);
}

window.addEventListener("load", function() {
    wsUrl = window.location.toString().includes("localhost") ? "ws://localhost:3011/rss" : "wss://" + window.location.host + "/rss";
    if(window.location.toString().includes("/chat")) { // Don't trigger if on operator screen; log-in system already implemented
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
    
                    setupJccDataChat(returned);
                },
                error   : function(returned) {
                    console.error(JSON.parse(returned.responseText));
                    $("#joinJcc").css("display", "");
                },
                data    : JSON.stringify(d)
            });
        });
    }
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
            typeOfPresenseRequest = 0;
        } else if($("#newMessageType").val().trim() == "!salts") {
            peopleMessageAppendingTo = createMessageRaw("paperPassedNot", "Connected Devices' IDs", "");
            ws.send(JSON.stringify({
                name : jccData.name,
                type : "requestPresence",
                salt : jccData.salt,
            }));
            $("#newMessageType").val("");
            typeOfPresenseRequest = 1;
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
});

function parseNewMessage(d) {
    if(d.type == "message" || d.type == "paperPassed") {
        createMessage(d);
    } else if(d.type == "requestPresence") {
        ws.send(JSON.stringify({
            type : "sendingName",
            mySalt : mySalt,
            name : `${$("#yourNameInput").text() || "[No Name]"} – Chat Window`
        }));
    } else if(d.type == "sendingName") {
        if(peopleMessageAppendingTo != null) {
            if(typeOfPresenseRequest == 0) {
                peopleMessageAppendingTo.append($("<p>").text(d.roomName));
            } else if(typeOfPresenseRequest == 1) {
                peopleMessageAppendingTo.append($("<p>").css("user-select", "text").text(`${d.roomName}: ${d.mySalt}`));
            }
        }
    } else if(d.type == "pastMessages") {
        d.pastMessages.forEach((m) => {
            createMessage(m);
        });
    }
}

function setupJccDataChat(data) { // Renamed to prevent potential conflict w/ the operator script
    jccData = data;

    $("#joinedJcc").css("display", "flex");

    ws = new WebSocket(wsUrl, "echo-protocol");
    
    ws.onopen = function(_e) {
        ws.send(JSON.stringify({
            name       : data.name,
            type       : "setup",
            salt       : data.salt,
            clientType : "chatScreen"
        }));
        $("#jccInfo").css("display", "inline-block");
    };
    ws.addEventListener("message", function(m) {
        var d = JSON.parse(m.data);
        parseNewMessage(d);
    });
}

document.onkeydown = function(event) {
    if(ws) {
        if(event.key == "Enter") {
            $("#sendMessageButton").click();
        }
    }
}