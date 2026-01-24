var selected = null;
var currentName = null;

var currentVoteName = "";

var ws = null;

function doLoginThing(name) {
    var ename = name;
    currentName = name;
    $("#loginButton").prop("disabled", "true");
    $("#newNameInput").prop("disabled", "true");
    $("#submitNewName").prop("disabled", "true");

    var d = {
        voteName : currentVoteName,
        name : ename
    };

    $.ajax({
        type    : "POST",
        url     : "/login",
        contentType : "application/json",
        success : function(returned) {
            console.log(returned);
            $("#resultText").text("");
            $("#login").remove();
            $("#currentVoteSpan").text(returned.cmt);

            $("#yeaButton").prop("disabled", false);
            $("#abstainButton").prop("disabled", false);
            $("#nayButton").prop("disabled", false);

            if(returned.pastVote == "yea") $("#yeaButton")[0].click()
            if(returned.pastVote == "nay") $("#nayButton")[0].click()
            if(returned.pastVote == "abstain") $("#abstainButton")[0].click()

            $("#statusp").text("Up to date");
        },
        error   : function(returned) {
            console.error(returned);
        },
        data : JSON.stringify(d)
    });
}

window.onload = function() {
    if(window.screen.height / window.screen.width > 1.25) {
        $("#bottomBar").css("flex-direction", "column");
    }

    $("#yeaButton").on("click", function(_e) {
        if(selected == "yea") return;

        $("#yeaButton").css("background-color", "#0f0");
        $("#abstainButton").css("background-color", "");
        $("#nayButton").css("background-color", "");

        selected = "yea";

        resendSelection();
    });
    $("#nayButton").on("click", function(_e) {
        if(selected == "nay") return;

        $("#yeaButton").css("background-color", "");
        $("#abstainButton").css("background-color", "");
        $("#nayButton").css("background-color", "#f00");

        selected = "nay";

        resendSelection();
    });
    $("#abstainButton").on("click", function(_e) {
        if(selected == "abstain") return;

        $("#yeaButton").css("background-color", "");
        $("#abstainButton").css("background-color", "#ed970e");
        $("#nayButton").css("background-color", "");

        selected = "abstain";

        resendSelection();
    });

    $("#submitNewName").on("click", function(_e) {
        doLoginThing($("#newNameInput").val());
    });

    $("#chooseUserButton").on("click", function(_e) {
        doLoginThing($("#loginSelector").val());
    });

    $("#resendVoteButton").on("click", function(_e) {
        resendSelection();
    });
}

function resendSelection() {
    //$("#statusp").text("Sending vote...");

    var d = {
        type : "sentVote",
        voteName : currentVoteName,
        person   : currentName,
        vote     : selected
    }

    ws.send(JSON.stringify(d));
}

function regetCurrentVote() {
    $("#statusp").text("Updating...");
    let d = {
        voteName : currentVoteName
    }
}

$("#loginButton").on("click", function() {
    let d = {
        voteName : $("#nameLabel").val()
    }
    currentVoteName = $("#nameLabel").val();
    $.ajax({
        type    : "POST",
        url     : "/getvote",
        contentType : "application/json",
        success : function(returned) {
            console.log(returned);

            $("#loginSelector > *").remove();
            var p = returned.voters.sort();
            for(var i = 0; i < p.length; i++) {
                $("#loginSelector").append(
                    $("<option>").html(p[i])
                )
            }

            $(".toEnable").attr("disabled", false);

            ws = new WebSocket("/ws", "echo-protocol");
            ws.onopen = function() {
                ws.send(JSON.stringify({
                    type : "setup",
                    voteName : currentVoteName
                }));
            }
            ws.onmessage = (message) => {
                console.log(message);

                let m = JSON.parse(message);

                if(m.type == "motionUpdate") {
                    $("#currentVoteSpan").text(m.newMotion);

                    $("#yeaButton").css("background-color", "");
                    $("#abstainButton").css("background-color", "");
                    $("#nayButton").css("background-color", "");

                    selected = "";
                }
            }
        },
        error   : function(returned) {
            console.error(returned);
        },
        data : JSON.stringify(d)
    });
});
