var scores = [-4, 4, 10];
var numQuestions = 26;
var penaltiesGoToOpposite = true;

$(document).ready(function() { // Soooon......
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

    let latestClicked = 0;

    for(let ii = 0; ii < numQuestions; ii++) {
        let i = ii*2;
        $(tLeftArray[i]).children("button").each(function() {
            if($(this).attr("data-clicked") == "true") {
                latestClicked = ii;
            }
        });
        $(tRightArray[i]).children("button").each(function() {
            if($(this).attr("data-clicked") == "true") {
                latestClicked = ii;
            }
        });
    }

    for(let ii = 0; ii < numQuestions; ii++) {
        let i = ii*2;
        let clickedArray = [];

        $(tLeftArray[i]).children("button").each(function() {
            clickedArray.push($(this).attr("data-clicked") == "true");
            if($(this).attr("data-clicked") == "true") {
                if(scores[Number($(this).attr("data-pointid"))] > 0 || !$("#penaltySide").prop("checked")) {
                    lscore += scores[Number($(this).attr("data-pointid"))];
                } else {
                    rscore -= scores[Number($(this).attr("data-pointid"))];
                }
            }
        });
        $(tRightArray[i]).children("button").each(function() {
            clickedArray.push($(this).attr("data-clicked") == "true");
            if($(this).attr("data-clicked") == "true") {
                if(scores[Number($(this).attr("data-pointid"))] > 0 || !$("#penaltySide").prop("checked")) {
                    rscore += scores[Number($(this).attr("data-pointid"))];
                } else {
                    lscore -= scores[Number($(this).attr("data-pointid"))];
                }
            }
        });

        $(tLeftArray[i]).children("button").each(function(i) {
            if(i == 0) {
                $(this).attr("disabled", clickedArray[1] || clickedArray[2]);
            }
            if(i == 1 || i == 2) {
                $(this).attr("disabled", clickedArray[4] || clickedArray[5] || clickedArray[0]);
            }
        });
        $(tRightArray[i]).children("button").each(function(i) {
            if(i == 0) {
                $(this).attr("disabled", clickedArray[4] || clickedArray[5]);
            }
            if(i == 1 || i == 2) {
                $(this).attr("disabled", clickedArray[1] || clickedArray[2] || clickedArray[3]);
            }
        });

        $($(tLeftArray[i]).children("p").get(1)).text(lscore);
        $($(tRightArray[i]).children("p").get(0)).text(rscore);

        if(lscore > rscore && ii <= latestClicked) {
            $($(tLeftArray[i]).children("p").get(1)).css("background-color", "rgb(100, 255, 100)");
        } else {
            $($(tLeftArray[i]).children("p").get(1)).css("background-color", "");
        }
        if(lscore < rscore && ii <= latestClicked) {
            $($(tRightArray[i]).children("p").get(0)).css("background-color", "rgb(100, 255, 100)");
        } else {
            $($(tRightArray[i]).children("p").get(0)).css("background-color", "");
        }
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

$("#resetAll").on("click", function() {
    $(".scoreButton").attr("data-clicked", false);
    $(".scoreButton").attr("data-disabled", false);
    $(".scoreButton").css("background-color", "");
    updateScores();
});

function setup() {
    numQuestions = Number($("#numquestions").val());

    scores = [Number($("#penaltyvalue").val()), Number($("#tossupvalue").val()), Number($("#bonusvalue").val())];

    var t = $("#tempDuplicate").clone(true).attr("id", "");
    var tr = $("#tempDuplicateRight").clone(true).attr("id", "");
    for(let i = 0; i < numQuestions; i++) {
        let tt = t.clone();
        $(tt.children("p").get(0)).text(`Q.${i+1}`);
        tt.children("button").attr("data-clicked", false);

        tt.children("button")[0].textContent = scores[0];
        tt.children("button")[1].textContent = "+" + scores[1];
        tt.children("button")[2].textContent = "+" + scores[2];

        tt.css("border-right", "1px solid #aaa");

        $("#leftButtons").append(tt);
        if(i != numQuestions-1) $("#leftButtons").append($("<div>").addClass("verticalDivider"));
    }
    for(let i = 0; i < numQuestions; i++) {
        let tt = tr.clone();
        $(tt.children("p").get(1)).text(`Q.${i+1}`);
        tt.children("button").attr("data-clicked", false);

        tt.children("button")[0].textContent = scores[0];
        tt.children("button")[1].textContent = "+" + scores[1];
        tt.children("button")[2].textContent = "+" + scores[2];

        $("#rightButtons").append(tt);
        if(i != numQuestions-1) $("#rightButtons").append($("<div>").addClass("verticalDivider"));
    }

    $(".scoreButton").mousedown(function(e) {
        if(e.button == 0 && $(this).attr("data-disabled") != "true") {
            if($(this).attr("data-clicked") == "true") {
                $(this).attr("data-clicked", "false");
                $(this).css("background-color", "");
            } else {
                $(this).attr("data-clicked", "true");
                $(this).css("background-color", $(this).attr("data-bg"));
                if($(this).attr("data-pointid") == 2) {
                    if($(this).prev().attr("data-clicked") != "true") {
                        let e = new MouseEvent("mousedown");
                        $(this).prev().get(0).dispatchEvent(e);
                    }
                }
            }
        } else if(e.button == 2) {
            $(this).attr("data-clicked", "false");
            if($(this).attr("data-disabled") == "true") {
                $(this).attr("data-disabled", false);
                $(this).attr("disabled", false);
                $(this).css("background-color", "");
                $(this).removeClass("hideHover");
            } else {
                $(this).attr("data-disabled", true);
                $(this).attr("disabled", true);
                $(this).css("background-color", "#aaa");
                $(this).addClass("hideHover");
            }
            updateScores();
            e.preventDefault();
            return false;
        }
        updateScores();
    });

    $("#blackout, #settingsPopup").css("display", "none");
}

$(".addButton").on("click", function() {
    $(this).prev().val(Number($(this).prev().val())+1);
    if(Number($(this).prev().val()) > Number($(this).prev().prop("max"))) {
        $(this).prev().val(Number($(this).prev().prop("max")));
    }
});

$(".subtractButton").on("click", function() {
    $(this).next().val(Number($(this).next().val())-1);
    if(Number($(this).next().val()) < Number($(this).next().prop("min"))) {
        $(this).next().val(Number($(this).next().prop("min")));
    }
});

$("#scibowlPreset").on("click", function() {
    $("#numquestions").val(26);
    $("#penaltyvalue").val(-4);
    $("#tossupvalue").val(4);
    $("#bonusvalue").val(10);
    $("#penaltySide").prop("checked", true);
});


$("#oceanbowlPreset").on("click", function() {
    $("#numquestions").val(20);
    $("#penaltyvalue").val(-4);
    $("#tossupvalue").val(4);
    $("#bonusvalue").val(6);
    $("#penaltySide").prop("checked", false);
});