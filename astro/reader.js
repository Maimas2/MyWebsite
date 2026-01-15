var data = null;

const tagSplitList = ["__", "==", "##", "$$", "%%"]

function doSearch() {
    let d = {searchTerm : $("#searchBarInput").val()};

    $.ajax({
        type : "POST",
        url  : "/api/search",
        contentType: 'application/json',
        data : JSON.stringify(d),
        success : function(res) {
            console.log(res.searchResults);
            for(let i = 0; i < 5; i++) {
                $(`#result${i}`).css("display", "none");
                $(`#result${i}`).attr("href", null);
                $(`#resultTitle${i}`).text("");
            }
            for(let i = 0; i < res.searchResults.length; i++) {
                $(`#result${i}`).css("display", "");
                $(`#resultTitle${i}`).text(res.searchResults[i][0]);
                $(`#resultEq${i}`).text(`\\(${res.searchResults[i][1]}\\)`);
                $(`#result${i}`).attr("href", res.searchResults[i][2]);
            }

            MathJax.typeset();
        }
    });
    $("#results").css("display", "block");
}

window.onload = (event) => {
    data = JSON.parse($("#rawDataText").text());
    setupPage();
    $("#rawDataText").remove();
    
    $("#loadingSpinner").animate({
        rotate: "-1080deg"
    }, 6000, "linear");
}

function showImageZoom(url, caption, license) {
    $("#imageZoomInPopup").css("display", "flex");

    $("#imageZoomCaption").text(caption);
    $("#imageZoomImage").attr("src", url);
    $("#imageZoomLicense").text(license);
}

function hideImageZoom() {
    $("#imageZoomInPopup").css("display", "none");
}

var footnotes = []

function processText(oggText, splitterLevel=0, stringify=false) { // Doesn't actually return a string, actually returns an array like a chad
    var commentSplit = oggText.split("+++");
    var ogText = "";
    for(var i = 0; i < commentSplit.length; i += 2) {
        ogText += commentSplit[i].trim();
    }
    ogText = ogText.replaceAll("\n\n\n\n", "\n\n");
    ogText.replaceAll("\n\n", "<br>");
    var splitIntoTags = ogText.split(tagSplitList[splitterLevel]);
    var lines = [splitIntoTags[0]];

    console.log(lines);

    for(var i = 1; i < splitIntoTags.length; i++) {
        if(splitIntoTags[i].startsWith("\n\n")) splitIntoTags[i] = splitIntoTags[i].slice(2);
        if(splitIntoTags[i].startsWith("image")) {
            var og       = splitIntoTags[i];

            var caption  = splitIntoTags[++i];
            var imageUrl = splitIntoTags[++i];
            var license  = splitIntoTags[++i];

            var ogLink;

            if(og.includes("c")) {
                ogLink = splitIntoTags[++i];
            }

            var t = $("<div>").addClass("floatRightImage");
            t.attr("target", "_blank");
            t.attr("data-destination", imageUrl);

            $("<img>").attr("src", imageUrl).appendTo(t);

            $("<p>").text(caption).appendTo(t);

            var licenseEl;
            if(og.includes("c")) licenseEl = $("<a>").attr("href", ogLink);
            else                 licenseEl = $("<p>");
            licenseEl.text(license + (og.includes("c") ? " 🗗" : "")).css("font-size", "75%").appendTo(t);

            t.on("mousedown", function(e) {
                if(e.which == 1 || e.which == 3) {
                    // Open zoom-in
                    showImageZoom(
                        $($(this).children("img")[0]).attr("src"),
                        $($(this).children("p")[0]).text(),
                        $($(this).children("p")[1]).text(),
                    );
                    if(e.which == 3) e.preventDefault();
                } else if(e.which == 2) {
                    window.open($(this).attr("data-destination"), "_blank");
                }
                e.preventDefault();
            });

            lines = lines.concat(t);
        } else if(splitIntoTags[i].startsWith("link") && !splitIntoTags[i].startsWith("linkto")) {
            var og = splitIntoTags[i];

            var display = processText(splitIntoTags[++i], splitterLevel+1, true);
            var dest    = splitIntoTags[++i];

            let isExternal = og.includes("e");
            let showsSign  = og.includes("e") && (!og.includes("s"));
            lines = lines.concat(
                $("<a>").attr("href", isExternal ? dest : ("/topics/" + dest)).text(display + (showsSign ? " 🗗" : "")).css("display", "inline")
            );
        } else if(splitIntoTags[i].startsWith("nlink")) {
            var og = splitIntoTags[i];

            var display = splitIntoTags[++i];
            var dest    = splitIntoTags[++i];

            if(og.includes("s")) { // Go to a LinkTo inside the page
                dest += "/" + splitIntoTags[++i];
            }

            lines = lines.concat(
                $("<a>").attr("href", "/nlink/" + dest).text(display).css("display", "inline")
            );
        } else if(splitIntoTags[i] == "rlink") {
            var display = splitIntoTags[++i];
            var dest    = splitIntoTags[++i];

            lines = lines.concat(
                $("<a>").attr("href", window.location.pathname + "/" + dest).text(display).css("display", "inline")
            );
        } else if(splitIntoTags[i] == "bold" || splitIntoTags[i] == "b") {
            var display = splitIntoTags[++i];

            lines = lines.concat(
                $("<b>").text(display)
            );
        } else if(splitIntoTags[i] == "i") {
            var display = splitIntoTags[++i];

            lines = lines.concat(
                $("<i>").text(display)
            );
        } else if(splitIntoTags[i] == "h2") {
            var display = splitIntoTags[++i].trim();

            lines = lines.concat(
                $("<h2>").text(display.replaceAll("\n",""))
            );

            splitIntoTags[i+1] = splitIntoTags[i+1].replaceAll("\n", "");
        } else if(splitIntoTags[i] == "h3") {
            var display = splitIntoTags[++i].trim();

            lines = lines.concat(
                $("<h3>").text(display.replaceAll("\n",""))
            );

            splitIntoTags[i+1] = splitIntoTags[i+1].replaceAll("\n", "");
        } else if(splitIntoTags[i] == "footnote") {
            footnotes = footnotes.concat(splitIntoTags[++i]);

            lines = lines.concat($("<sup>").text(footnotes.length));
        } else if(splitIntoTags[i] == "newl") {
            lines = lines.concat($("<br><br>"))
        } else if(splitIntoTags[i] == "linkto") {
            var term = splitIntoTags[++i];

            lines = lines.concat(
                $("<div>").attr("id", "ScrollId" + term)
            );
        } else if(splitIntoTags[i] == "collapse") {
            var tc = $("#collapsePrefab").clone();

            tc.children("h3").text("▶ " + splitIntoTags[++i]);
            tc.children("h3").prop("--data-open", "false");
            tc.children("h3").on("click", function(_e) {
                tc.children("h3").prop("--data-open", !tc.children("h3").prop("--data-open"));

                if(tc.children("h3").prop("--data-open")) {
                    tc.children("div").css("display", "none");
                } else {
                    tc.children("div").css("display", "");
                }
            });

            processText(splitIntoTags[++i], smartDetectSplitterLevel(splitIntoTags[i]), true).forEach(el => {
                tc.children("div").append(el);
            });
            tc.children("div").css("display", "none");

            lines = lines.concat($("<br>"));
            lines = lines.concat(tc);
            lines = lines.concat($("<br>"));
        } else if(splitIntoTags[i] == "examplemotion") {
            var display = splitIntoTags[++i].trim();

            var toAppend = $("<div>").addClass("knowledgeNotice").addClass("outlineddiv").css("margin-top", "10px").css("display", "flex").css("flex-direction", "column").css("width", "100%");

            var t = processText(display, splitterLevel+1);

            t.forEach((el) => {
                if(typeof el == "object") { // jQuery element
                    toAppend.append(el.css("display", "inline"));
                } else {
                    console.log(el);
                    var t = el.split("<br>");
                    t.forEach((el) => {
                        toAppend.append( $(document.createTextNode(el)) ).css("display", "inline-block");
                        if(el != t[t.length-1]) toAppend.append( $("<br>") );
                    });
                }
            });

            lines = lines.concat(toAppend);
            lines = lines.concat($("<br>"));
            lines = lines.concat($("<br>"));
        } else if(splitIntoTags[i].startsWith("list")) {
            var og = splitIntoTags[i];
            
            var toAdd;
            if(og.includes("n")) {
                toAdd = $("<ol>");
            } else {
                toAdd = $("<ul>");
            }

            let l = 0; // Anti-infinite loop measure
            while(splitIntoTags[++i].replaceAll("\n", "<br>") != "tsil" && ++l < 100) {
                var els = processText(splitIntoTags[i].replaceAll("\n", ""), splitterLevel+1);
                var toapp = $("<li>").append();
                els.forEach((el) => {
                    if(typeof el == "object") toapp.append(el);
                    else toapp.append(document.createTextNode(el))
                });
                toAdd.append(
                    toapp
                );
                
            }

            lines = lines.concat(toAdd);
        } else {
            splitIntoTags[i] = splitIntoTags[i].replaceAll("\n\n", "<br><br>");
            lines = lines.concat(splitIntoTags[i]);
        }
    }
    if(splitterLevel == 0) {
        console.log(lines);
        
        for(var i = 0; i < lines.length; i++) {
            if(typeof lines[i] == "string" && lines[i].includes("\\<")) {
                $("#textcontain").append($(lines[i]));
            } else if(typeof lines[i] == "object") { // jQuery element
                $("#textcontain").append(lines[i]);
            } else {
                var t = lines[i].split("<br>");
                t.forEach((el) => {
                    $("#textcontain").append( $(document.createTextNode(el)) ).css("display", "inline");
                    if(el != t[t.length-1]) $("#textcontain").append( $("<br>") );
                });
            }
        }

        if(footnotes.length) {
            $("#textcontain").append($("<br>")).append($("<br>"));
            $("#textcontain").append($("<hr>"));
            $("#textcontain").append($("<br>"));

            for(var i = 0; i < footnotes.length; i++) {
                $("#textcontain").append($("<sup>").text((i+1) + " "));

                processText(footnotes[i], smartDetectSplitterLevel(footnotes[i]), true).forEach(el => {
                    $("#textcontain").append(el).append($("<br>"));
                });
            }

            $("#textcontain").append($("<br>")).append($("<br>"));
            $("#textcontain").append($("<br>")).append($("<br>"));
        }
        
    } else {
        if(stringify) {
            var toReturn = [];
            lines.forEach((line) => {
                // if((typeof line != "string") && "html" in line) toReturn = toReturn.concat(line[0].outerHtml);
                // else if((typeof line != "string") && "text" in line) toReturn = toReturn.concat(line.text());
                // else if((typeof line != "string") && "textContent" in line) toReturn = toReturn.concat(line.textContent);
                // else               toReturn = toReturn.concat(line);
                if(typeof line == "object") toReturn.concat(line)
                else toReturn = toReturn.concat(line);
            });
            return toReturn;
        } else {
            return lines;
        }
    }
}

function smartDetectSplitterLevel(s) { // This is not a very smart function
    for(var i = tagSplitList.length; i > 1; i--) {
        if(s.includes(tagSplitList[i])) return i;
    }
    return 1;
}

function setupPage() {
    console.log(data);

    if(!data.success) {
        $("#pageTitleLabel").text("404 Page not found");
        $("#loadingOverlay").remove();
        return;
    }
    

    if(data.type == "page") {
        $("#subtopicsOuterContainer").css("display", "none");

        $("#pageTitleLabel").text(data.fancyName);

        footnotes = [];
        processText(data.fullText.replaceAll("\\n", "\n"));

        $(document).prop("title", data.fancyName);

        $("#loadingOverlay").remove();
        $("#randomEquationLink").remove();
    } else if(data.type == "equation") {
        $("#subtopicsOuterContainer").css("display", "none");

        $("#pageTitleLabel").text(data.fancyName);

        $("#bigEquation").html(`\\[ ${data.equation} \\]`);

        footnotes = [];
        processText(data.fullText.replaceAll("\\n", "\n"));

        $(document).prop("title", data.fancyName);

        $("#loadingOverlay").remove();
        $("#randomEquationLink").remove();

        MathJax.typeset();
    } else if(data.type == "home") {
        $("#subtopicsOuterContainer").css("display", "none");

        $("#pageTitleLabel").text("Astronomy and Astrophysics Equations");

        $("#randomEquation").html(`\\[ ${data.randomEquation.equationText} \\]`);
        $("#randomEquationHeader").text(`Random Equation: ${data.randomEquation.fancyName}`);
        $("#randomEquationLink").attr("href", `/topics/${data.randomEquation.name}`);

        footnotes = [];
        processText(data.fullText.replaceAll("\\n", "\n"));

        $(document).prop("title", "Astrophysics Equations");

        $("#loadingOverlay").remove();
        $("#parentLink").css("opacity", "0");

        MathJax.typeset();
    }

    if(window.location.pathname.includes("/topics/alleqs")) {
        MathJax.typeset();

        $("h2").css("text-align", "center");
    }

    return;
}

// $("#searchBarInput").on("focus", function() {
//     doSearch();
// });

$("*:not(#searchBarInput)").on("click", function() {
    $("#results").css("display", "none");
});

var lastSearchVal = $("#searchBarInput").val();

setInterval(function() {
    if($("#searchBarInput").val() != lastSearchVal) {
        doSearch();
        lastSearchVal = $("#searchBarInput").val();
    }
}, 500);