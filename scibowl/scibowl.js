var t = $("#tempDuplicate").clone(true).attr("id", "");
for(let i = 0; i < 25; i++) {
    let tt = t.clone();
    $(tt.children("p").get(0)).text(`Q.${i+2}`);
    tt.children("button").attr("data-clicked", false);
    $("#leftButtons").append(tt);
}
for(let i = 0; i < 25; i++) {
    let tt = t.clone();
    $(tt.children("p").get(0)).text(`Q.${i+2}`);
    tt.children("button").attr("data-clicked", false);
    $("#rightButtons").append(tt);
}

$(".scoreButton").mousedown(function(e) {
    if(e.button == 0) {
        if($(this).attr("data-clicked") == "true") {
            $(this).attr("data-clicked", "false");
            $(this).css("background-color", "");
        } else {
            $(this).attr("data-clicked", "true");
            $(this).css("background-color", $(this).attr("data-bg"));
        }
    } else {
        if($(this).attr("data-disabled") == "true") {
            $(this).attr("data-disabled", false);
            $(this).css("background-color", "");
            $(this).removeClass("hideHover");
        } else {
            $(this).attr("data-disabled", true);
            $(this).css("background-color", "#777");
            $(this).addClass("hideHover");
        }
        e.preventDefault();
        return false;
    }
    updateScores();
});

$(document).ready(function() {
    $("#shareGame").on("click", function() {
        
        var d = {
            name     : prompt("Name"),
            password : prompt("Password")
        };
        if(d.name == null)
        hidePopup();
        $("#startJCC").css("display", "none");
        $.ajax({
            type    : "POST",
            url     : "/createJCC",
            contentType: 'application/json',
            success : function(returned) {
                console.log(returned);

                setupJccData(returned);
            },
            error   : function(returned) {
                console.error(JSON.parse(returned.responseText));
                createAlert(JSON.parse(returned.responseText).message);
                $("#startJCC").css("display", "inline-block");
            },
            data    : JSON.stringify(d)
        });
    })
});


function updateScores() {
    let tLeftArray = $("#leftButtons").children().toArray();
    let tRightArray = $("#rightButtons").children().toArray();
    let lscore = 0;
    let rscore = 0;
    for(let i = 0; i < 26; i++) {
        $(tLeftArray[i]).children("button").each(function() {
            if($(this).attr("data-clicked") == "true") {
                if(Number($(this).attr("data-points")) > 0) {
                    lscore += Number($(this).attr("data-points"));
                } else {
                    rscore -= Number($(this).attr("data-points"));
                }
            }
        });
        $(tRightArray[i]).children("button").each(function() {
            if($(this).attr("data-clicked") == "true") {
                if(Number($(this).attr("data-points")) > 0) {
                    rscore += Number($(this).attr("data-points"));
                } else {
                    lscore -= Number($(this).attr("data-points"));
                }
            }
        });
        $($(tLeftArray[i]).children("p").get(1)).text(lscore);
        $($(tRightArray[i]).children("p").get(1)).text(rscore);
    }
    $($("#leftScore").children("p").get(0)).text(lscore);
    $($("#rightScore").children("p").get(0)).text(rscore);

    if(lscore > rscore) {
        $("#leftScore").css("background-color", "rgb(100, 255, 100)");
    } else {
        $("#leftScore").css("background-color", "");
    }
    if(lscore < rscore) {
        $("#rightScore").css("background-color", "rgb(100, 255, 100)");
    } else {
        $("#rightScore").css("background-color", "");
    }
}