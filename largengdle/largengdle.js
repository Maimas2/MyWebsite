const { floor, random, max, min, log10 } = Math;

var chosenNumber = -1n;

var badgesWon = [  ];

var sumPoints = 0;

var toShow = [];

function generateRandom() {
    // TODO
}

async function doTheThing() {
    var initialWidth = $("#bignumber").width() + 18; // Can't forget padding + border

    $("#initialGenerate").remove();

    var chosenStr = String(chosenNumber);

    for(var i = 0; i < chosenStr.length; i++) {
        $("#bignumber").append(
            $("<span>").attr("id", `span${i}`).text(chosenStr[i] + ((chosenStr.length - i + 2) % 3 == 0 && chosenStr.length - i != 1 ? "," : "")).addClass("innerSpan")
        );
    }

    var afterWidth = $("#bignumber").width() + 18 + 20; // Give it some more padding

    $("#bignumber").css("width", initialWidth);
    $("#bignumber").animate({
        width : afterWidth,
        padding: 18
    })

    for(var i = 0; i < chosenStr.length; i++) {
        (function(innerI) {
            setTimeout(function() {
                $(`#span${innerI}`).animate({
                    opacity: 1
                }, 150)
            }, i * 250 + 1500);
        })(i)
    }

    toShow = [ ];
    
    // $("#pointsTotal").text(`${sumPoints.toFixed(min(2, max(0, 3-floor(log10(Number(sumPoints))))))} pts total`);
    $("#pointsTotal").text("0.00 pts total");

    for(var badgeid = 0; badgeid < badgesWon.length; badgeid++) {
        let badge = badgesWon[badgeid];
        let toAdd = $("<div>").addClass("badgeContainer");
        toAdd.append(
            $("<h3>").text(badge.name)
        );
        toAdd.append(
            $("<p>").text(badge.desc)
        );

        if(badge.highlight) {
            let toAdd2 = $("<h2>");
            for(var i = 0; i < chosenStr.length; i++) {
                let tempSpan = $("<span>").attr("id", `span${i}`).text(chosenStr[i]).addClass("innerSpan smallSpanHighlight");
                if(badge.highlight[i]) tempSpan.css("background-color", badge.highlight[i]);

                toAdd2.append(tempSpan);
                if((chosenStr.length - i + 2) % 3 == 0 && chosenStr.length - i != 1) toAdd2.append($("<span>").text(","));
            }
            toAdd.append(toAdd2);
        }

        toAdd.append(
            $("<p>").append($("<b>").append($("<i>").text(`${ badge.value.toFixed(max(0, 2-floor(log10(Number(badge.value))))) } pts`)))
        );

        toShow.push(toAdd);
    }

    await new Promise(resolve => setTimeout(resolve, 2000));

    for(var i = toShow.length-1; i >= 0; i--) {
        $("#badgesWonContainer").prepend($("<br>"));
        $("#badgesWonContainer").prepend(toShow[i]);

        if(badgesWon[i].value < 100) {
            toShow[i].css("box-shadow", "0px 0px 0px 0px rgb(0, 0, 255)");
            toShow[i].animate({
                boxShadow : "0px 0px 20px 0px rgba(0, 0, 255, 0)"
            }, 500)
        } else if(badgesWon[i].value < 1000) {
            toShow[i].animate({
                boxShadow : "0px 0px 5px 0px gold, inset 0px 0px 15px 0px gold"
            }, 500)
        }

        sumPoints += badgesWon[i].value;

        $("#pointsTotal").text(`${sumPoints.toFixed(min(2, max(0, 3-floor(log10(Number(sumPoints))))))} pts total`);

        await new Promise(resolve => setTimeout(resolve, 600));
    }

    setTimeout(function() {
        if(sumPoints > 50) {
            const end = Date.now() + 15 * 1e3;
            const colors = ["#bb0000", "#ffffff"];
            (function frame() {
            confetti({
                particleCount: 2,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors
            });
            confetti({
                particleCount: 2,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors
            });
            if (Date.now() < end) requestAnimationFrame(frame);
            })();
        }
    }, );
}

window.onload = function() {
    $("#bignumber").on("click", function() {
        $("#bignumber").addClass("nohover");
        $("#initialGenerate").animate({ opacity : 0 }, 150, function() {
            $.ajax({
                type : "GET",
                url : "/generatenumber" + (window.location.pathname.length > 1 ? window.location.pathname.replaceAll("/", "?") : ""),
                //contentType : "application/json",
                success : function(_e) {
                    let d = JSON.parse(_e);
                    chosenNumber = BigInt(d.num);
                    badgesWon = d.badgesWon;
                    //sumPoints = d.sumPoints;
                    doTheThing();
                }
            })
        });
    })
}