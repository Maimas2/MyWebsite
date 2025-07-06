var selected = null;
var currentName = null;

var previousVoteList = { };

function cleanText(s) {
    return s.replaceAll(" ", "").replaceAll("#", "").replaceAll(".", "");
}

function toColor(s) {
    if(s == "yea") return "#7f7";
    if(s == "nay") return "#f99";
    if(s == "abstain") return "rgb(255, 204, 108)";
    return s;
}

function reloadVotes() {
    if($("#login").length) return;
    $.ajax({
        type    : "GET",
        url     : "/getvotes",
        success : function(returned) {
            //console.log(returned);

            var yeas = 0;
            var nays = 0;
            var abstains = 0;
            
            var keys  = Object.keys(returned).sort();

            var toReturn = "";

            $("#bottomBar > *").remove();

            for(let i = 0; i < keys.length; i++) {
                if(returned[keys[i]] == "yea") yeas++;
                if(returned[keys[i]] == "nay") nays++;
                if(returned[keys[i]] == "abstain") abstains++;

                //toReturn += keys[i] + ": " + returned[keys[i]] + "<br>";

                $("#bottomBar").append(
                    $("<div>").addClass("outlineddiv").css("width", "30%").css("display", "inline-block").css("padding", "5px").css("margin", "3px").css("background-color", toColor(returned[keys[i]])).append(
                        $("<p>").css("display", "inline").text(keys[i])// + ": " + toColor(returned[keys[i]]))
                    )
                )
            }

            $("#totalPresent").text(`${keys.length} Present`);
            $("#yeas").text(`${yeas} Yeas`);
            $("#nays").text(`${nays} Nays`);

            previousVoteList = returned;
            $("#votesText").html(toReturn);
        },
        error   : function(returned) {
            console.error(returned);
        },
        async   : false
    });
}

window.onload = function() {
    if(window.screen.height / window.screen.width > 1.25) {
        $("#bottomBar").css("flex-direction", "column");
    }

    $("#loginButton").on("click", function(_e) {
        if($("#pwLabel").val() != "ilovepatboyd") {
            $("#loginButton").text("Wrong password");
            return;
        }
        $("#login").remove();
        reloadVotes();
    });

    $("#setNewMotion").on("click", function(_e) {
        var t = prompt("What's the new vote's name/description?")
        if(t == null) return;
        var d = {
            newMotion : t
        };

        $.ajax({
            type    : "POST",
            url     : "/setcurrentmotion",
            contentType : "application/json",
            success : function(returned) {
                console.log(returned);
            },
            error   : function(returned) {
                console.error(returned);
            },
            data    : JSON.stringify(d)
        });
    });

    setInterval(reloadVotes, 1000);
}