var names = ["Aaron", "Alex C", "Alex S", "Drew", "JT", "Karl", "Oliver", "Patrick", "Will", "Xavier"];

var selected = null;
var currentName = null;

names.forEach(name => {
    $("#nameselect").append(
        $("<option>").val(name).text(name)
    )
});

function doLoginThing(name) {
    var ename = name;
    currentName = name;
    $("#loginButton").prop("disabled", "true");
    $("#newuserButton").prop("disabled", "true");

    var d = {
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

            setInterval(regetCurrentVote, 3000);
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

    $("#newuserButton").on("click", function(_e) {
        doLoginThing($("#nameLabel").val());
    });

    $("#loginButton").on("click", function(_e) {
        doLoginThing($("#selectName").val());
    });

    $("#resendVoteButton").on("click", function(_e) {
        regetCurrentVote();
        resendSelection();
    });

    $.ajax({
        type    : "GET",
        url     : "/getpeople",
        success : function(returned) {
            console.log(returned);

            var p = returned.people.sort();
            for(var i = 0; i < p.length; i++) {
                $("#selectName").append(
                    $("<option>").html(p[i])
                )
            }

            $("#loginButton").prop("disabled", false);
            $("#newuserButton").prop("disabled", false);
            $("#selectName").prop("disabled", false);
        },
        error   : function(returned) {
            console.error(returned);
        }
    });
}

function resendSelection() {
    $("#statusp").text("Sending vote...");

    var d = {
        person   : currentName,
        vote     : selected,
        voteName : $("#currentVoteSpan").text()
    }

    $.ajax({
        type    : "POST",
        url     : "/submitvote",
        contentType : "application/json",
        success : function(returned) {
            console.log(returned);
            $("#statusp").text("Up to date");
        },
        error   : function(returned) {
            console.error(returned);
            $("#statusp").text("Error (check console)");
        },
        data : JSON.stringify(d)
    });
}

function regetCurrentVote() {
    $("#statusp").text("Updating...");
    $.ajax({
        type    : "GET",
        url     : "/getcurrentmotion",
        success : function(returned) {
            console.log(returned);
            if(returned != $("#currentVoteSpan").text()) {
                $("#yeaButton").css("background-color", "");
                $("#abstainButton").css("background-color", "");
                $("#nayButton").css("background-color", "");

                selected = null;
            }
            $("#currentVoteSpan").text(returned);
            $("#statusp").text("Up to date");
        },
        error   : function(returned) {
            console.error(returned);
            $("#statusp").text("Error (check console)");
        }
    });
}