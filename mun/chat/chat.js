// Licensed under GPLv3

var ws;

var jccData;

var wsUrl;

var peopleMessageAppendingTo = null;

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

function setupJccData(data) {
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
        console.log(m.data);
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
        }
    });
}

document.onkeydown = function(event) {
    if(ws) {
        if(event.key == "Enter") {
            $("#sendMessageButton").click();
        }
    }
}