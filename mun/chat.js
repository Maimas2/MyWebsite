// Licensed under GPLv3

var ws;

var jccData;

function createMessage(data, isFromSelf=false) {
    var toAdd = $("<div>").addClass("outlineddiv").css("padding", "15px");

    if(data.type == "message") {
        if(isFromSelf) {
            toAdd.css("text-align", "right");
            toAdd.css("background-color", "color-mix(in srgb, powderblue 50%, white 50%)");
            toAdd.css("border-radius", "20px 20px 3px 20px");
        } else {
            toAdd.css("border-radius", "20px 20px 20px 3px");
        }

        toAdd.append($("<p>").text(data.sender).css("font-weight", "bold"));
        toAdd.append($("<p>").text(data.messageBody));
    } else if(data.type == "paperPassed") {
        toAdd.css("background-color", "#cccccc");

        toAdd.append($("<p>").text(data.sender + " passed a paper:").css("font-weight", "bold"));
        toAdd.append($("<p>").text(data.messageBody));
        toAdd.css("text-align", "center");
    }

    $("#chatMessageContainer").append(toAdd);
}

window.onload = function() {
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
    })
}

function setupJccData(data) {
    jccData = data;

    $("#joinedJcc").css("display", "flex");

    ws = new WebSocket("ws://mun.localhost:3002", "echo-protocol");
    
    ws.addEventListener("open", function(_e) {
        ws.send(JSON.stringify({
            name       : data.name,
            type       : "setup",
            salt       : data.salt,
            clientType : "chatScreen"
        }));
        $("#jccInfo").css("display", "inline-block");
    });
    ws.addEventListener("message", function(m) {
        console.log(m.data);
        var d = JSON.parse(m.data);
        if(d.type == "message") {
            createMessage(JSON.parse(m.data));
        } else if(d.type == "paperPassed") {
            m.data.messageBody += " please help me they trapped me in a";
            createMessage(JSON.parse(m.data));
        }
    });
}