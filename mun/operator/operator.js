// Licensed under GPLv3
// Holy hell this might be the worst code I have ever written
// I apologize to future me. Dated, 9 Mar. 2026

// var ws;

// var jccData;

// var wsUrl;

// var peopleMessageAppendingTo = null;

var watchingSalt1 = null;
var watchingSalt2 = null;

var seenSalts1 = [];
var seenSalts2 = [];

// function createMessageRaw(type, sender, body, isFromSelf=false) {
//     var toAdd = $("<div>").addClass("outlineddiv").css("padding", "15px");

//     if(type == "message") {
//         if(isFromSelf) {
//             toAdd.css("text-align", "right");
//             toAdd.css("background-color", "color-mix(in srgb, powderblue 50%, white 50%)");
//             toAdd.css("border-radius", "20px 20px 3px 20px");
//         } else {
//             toAdd.css("border-radius", "20px 20px 20px 3px");
//         }

//         toAdd.append($("<p>").text(sender).css("font-weight", "bold"));
//         toAdd.append($("<p>").text(body));
//     } else if(type.startsWith("paperPassed")) {
//         toAdd.css("background-color", "#cccccc");

//         if(type == "paperPassed") {
//             toAdd.append($("<p>").text(sender + " passed a paper:").css("font-weight", "bold"));
//         } else if(type == "paperPassedNot") {
//             toAdd.append($("<p>").text(sender).css("font-weight", "bold"));
//         }

//         toAdd.append($("<p>").text(body));
//         toAdd.css("text-align", "center");
//     }

//     $("#chatMessageContainer").append(toAdd);

//     $("#chatMessageContainer").animate({
//         scrollTop : $("#chatMessageContainer div:last").offset().top
//     }, 300);

//     return toAdd;
// }

// function createMessage(data, isFromSelf=false) {
//     createMessageRaw(data.type, data.sender, data.messageBody, isFromSelf);
// }

window.addEventListener("load", function() {
    wsUrl = window.location.toString().includes("localhost") ? "ws://localhost:3011/rss" : "wss://" + window.location.host + "/rss";
    $("#joinop").on("click", function(_e) {
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
    // $("#sendMessageButton").on("click", function(_e) {
    //     if($("#newMessageType").val().replaceAll(" ", "") == "") return;
    //     if($("#newMessageType").val().trim() == "!people") {
    //         peopleMessageAppendingTo = createMessageRaw("paperPassedNot", "Devices Connected", "");
    //         ws.send(JSON.stringify({
    //             name : jccData.name,
    //             type : "requestPresence",
    //             salt : jccData.salt,
    //         }));
    //         $("#newMessageType").val("");
    //     } else {
    //         var d = {
    //             name       : jccData.name,
    //             type       : "message",
    //             salt       : jccData.salt,
    //             messageBody: $("#newMessageType").val(),
    //             sender     : $("#yourNameInput").val()
    //         };
    //         ws.send(JSON.stringify(d));
    //         createMessage(d, true);
    //         $("#newMessageType").val("");
    //     }
    // });
});

String.prototype.toTitleCase = function() {
    return this.split(" ").map(s => s[0].toUpperCase() + s.substring(1)).join(" ");
}

function motFancy(cm) {
    if(cm.motionType == "mod") return `In a ${durationToString(cm.duration).replaceAll(":00", "")} : ${durationToString(cm.delegateDuration).replaceAll(":00", "")} mod`;
    if(cm.motionType == "unmod") return `In a ${durationToString(cm.duration)} unmod`;
    if(cm.motionType == "roundRobin") return `In a ${durationToString(cm.duration)} round robin`;
    if(cm.motionType == "speakersList") return `In the speakers list`;
    if(cm.motionType == "presentPapers") return "Presenting papers";
    return "Unknown motion."
}

function basicNameToFancy(cm) {
    if(cm.type == "mod") return "Mod";
    if(cm.type == "unmod") return "Unmod"
    if(cm.type == "roundRobin") return "Round Robin";
    if(cm.type == "speakersList") return `Speakers List`;
    if(cm.type == "presentPapers") return "Present Papers";
    if(cm.type == "custom") return `Custom ("${cm.topic}")`;
}

function parseResponse(d, num) {
    let dd = d.state;

    let numPresent = 0;
    Object.keys(dd.attendance).forEach((k) => {
        if(dd.attendance[k] && dd.attendance[k] != "Ab") numPresent++;
    });

    $(`#watcherName${num}`).text(dd.committeeName);
    $(`#watcherCount${num}`).text(`${numPresent} Delegates`);

    if(dd.isThereACurrentMotion) {
        if(dd.motionType == "custom") {
            $(`#watcherDetails${num}`).text(dd.currentMotion.fancyMotionType);
        } else {
            let toSet = motFancy(dd.currentMotion);

            // {"mySalt":"","committeeName":"[No name]","dictOfCustomDelegates":{},"attendance":{"Afghanistan":"Pr","Albania":"Pr"},"proposedMotions":[{"type":"roundRobin","rngid":"98","topic":"g","delegateDuration":15}],"isThereACurrentMotion":false,"isThereARollCall":false,"isImpromptuTimerOpen":false,"impromptuTime":300,"currentMotion":{},"rollCallDetails":{"listOfVotes":[]}}

            if(dd.currentMotion.timerType == "perDelegate") {
                if(dd.currentMotion.type != "roundRobin") {
                    if(dd.currentMotion.currentDelegate == -1) {
                        if(dd.currentMotion.chosenCountries.length == 0) {
                            toSet += "<br><br>Choosing speakers"
                        } else {
                            toSet += `<br><br>${dd.currentMotion.chosenCountries[0]} speaking first`;
                        }
                    } else {
                        toSet += `<br><br>${dd.currentMotion.chosenCountries[dd.currentMotion.currentDelegate]} is speaking (${dd.currentMotion.currentDelegate+1}/${Math.floor(dd.currentMotion.duration / dd.currentMotion.delegateDuration)})`;
                    }
                }
            }

            $(`#watcherDetails${num}`).html(toSet);
        }

        if(dd.currentMotion.timerType == "none") {
            $(`#watcherTime${num}`).text("");
        } else {
            $(`#watcherTime${num}`).text(durationToString(Number(dd.currentMotion.currentTime)));
        }

        if(dd.isImpromptuTimerOpen) {
            $(`#watcherTime${num}`).text("Impromptu timer: " + durationToString(Number(dd.impromptuTime)));
        }
    } else {
        $(`#watcherDetails${num}`).text(`${dd.proposedMotions.length} proposed motions${dd.proposedMotions.length ? ": " : ""}${dd.proposedMotions.map((cm) => basicNameToFancy(cm)).join(", ")}`);
        if(dd.isImpromptuTimerOpen) {
            $(`#watcherTime${num}`).text("Impromptu timer: " + durationToString(Number(dd.impromptuTime)));
        } else {
            $(`#watcherTime${num}`).text("--:--")
        }
    }
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
        //console.log(m.data);
        if(m.data == "Connected") {
            ws.send(JSON.stringify({
                name       : data.name,
                type       : "requestMirrors",
                salt       : data.salt
            }));
        } else {
            var d = JSON.parse(m.data);
            parseNewMessage(d);

            if(d.type == "sendMirror") {
                if(d.state.mySalt == watchingSalt1) {
                    parseResponse(d, 1);
                } else if(d.state.mySalt == watchingSalt2) {
                    parseResponse(d, 2);
                } else {
                    if(!seenSalts1.includes(d.state.mySalt)) {
                        $("#joinerButtons1").append($("<button>").attr("data-buttonsalt", d.state.mySalt).addClass("paddingButton joinButton").text(d.state.committeeName).on("click", function() {
                            if(d.state.mySalt == watchingSalt2) {
                                $(this).remove();
                                return;
                            }

                            $("#joiner1").css("display", "none");
                            $("#watcher1").css("display", "flex");
    
                            watchingSalt1 = d.state.mySalt;

                            ws.send(JSON.stringify({
                                name       : jccData.name,
                                salt       : jccData.salt,
                                type       : "requestMirrors"
                            }));

                            $("button.joinButton").each(function() {
                                //console.log($(this).attr("data-buttonsalt"));
                                if($(this).attr("data-buttonsalt") == d.state.mySalt) $(this).remove();
                            });
                        }));
                        seenSalts1.push(d.state.mySalt);
                    }
                    if(!seenSalts2.includes(d.state.mySalt)) {
                        $("#joinerButtons2").append($("<button>").attr("data-buttonsalt", d.state.mySalt).addClass("paddingButton joinButton").text(d.state.committeeName).on("click", function() {
                            if(d.state.mySalt == watchingSalt1) {
                                $(this).remove();
                                return;
                            }

                            $("#joiner2").css("display", "none");
                            $("#watcher2").css("display", "flex");
    
                            watchingSalt2 = d.state.mySalt;

                            ws.send(JSON.stringify({
                                name       : jccData.name,
                                salt       : jccData.salt,
                                type       : "requestMirrors"
                            }));

                            $("button.joinButton").each(function() {
                                //console.log($(this).attr("data-buttonsalt"));
                                if($(this).attr("data-buttonsalt") == d.state.mySalt) $(this).remove();
                            });
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
    seenSalts2 = [];
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

    seenSalts1 = [];
    seenSalts2 = [];
    watchingSalt2 = null;

    ws.send(JSON.stringify({
        name       : jccData.name,
        salt       : jccData.salt,
        type       : "requestMirrors"
    }));
});

$(".refreshButton").on("click", function() {
    seenSalts1 = [];
    seenSalts2 = [];
    $(".joinButton").remove();

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