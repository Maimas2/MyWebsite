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
        if($(this).prop("disabled")) {
            $(this).prop("disabled", false);
        } else {
            $(this).prop("disabled", true);
        }
        e.preventDefault();
        return false;
    }
    updateScores();
});

$(document).ready(function() {
    $(document).bind("contextmenu", function(e) {
        return false;
    });
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
}