var data = null;

const tagSplitList = ["__", "==", "##", "$$", "%%"]

window.MathJax = {
    loader: {load: ['[tex]/mhchem']},
    tex: {packages: {'[+]': ['mhchem']}}
};

function createSubtopicElement(el) {
    if(el.subtopicName == "main") el.subtopicName = ""

    var main = $("<a>", {class: "subtopicchip"}).attr("href", window.location.pathname + (window.location.pathname.endsWith("/") ? "" : "/") + el.name + (el.name.endsWith("/") ? "" : "/"));

    var titlee = $("<h3>", {class: "subsubtopicchip"}).text(el.fancyName).css("margin-top", "0").appendTo(main);

    $("<p>", {class: "subsubtopicchip"}).text(el.description).css("margin", "0").appendTo(main);

    var t = $("#" + el.subtopicName.replaceAll(" ", "") + "SubtopicContainer");
    if(!t.length) {
        $("#subtopicsOuterContainer").append(
            $("<div>").attr("id", el.subtopicName.replaceAll(" ", "") + "SubtopicContainer").append($("<h2>").text((el.subtopicName == "") ? "Subtopics" : el.subtopicName))
        );
        t = $("#" + el.subtopicName.replaceAll(" ", "") + "SubtopicContainer");
    }
    t.append(main);

    //$("#subtopiccontainer").append(main);
}

window.onload = (event) => {
    data = JSON.parse($("#rawDataText").text());
    setupPage();
    $("#rawDataText").remove();
    
    $("#loadingSpinner").animate({
        rotate: "-1080deg"
    }, 6000, "linear")
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
    //ogText.replaceAll("\n\n", "<br>");
    var commentSplit = oggText.split("+++");
    var ogText = "";
    for(var i = 0; i < commentSplit.length; i += 2) {
        ogText += commentSplit[i];
    }
    ogText = ogText.replaceAll("\n\n\n\n", "\n\n");
    var splitIntoTags = ogText.split(tagSplitList[splitterLevel]);
    var lines = [splitIntoTags[0]];

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
        } else if(splitIntoTags[i].startsWith("link")) {
            var og = splitIntoTags[i];

            var display = splitIntoTags[++i];
            var dest    = splitIntoTags[++i];

            lines = lines.concat(
                $("<a>").attr("href", og.includes("e") ? dest : ("/topics/" + dest)).text(display + (og.includes("e") ? " 🗗" : "")).css("display", "inline")
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
        } else if(splitIntoTags[i] == "knowledge") {
            var display = splitIntoTags[++i].trim();

            lines = lines.concat(
                $("<div>").addClass("knowledgeNotice").addClass("outlineddiv").css("display", "flex").append(
                    $("<img>").attr("src", "/images/info.svg").css("display", "inline").css("margin-right", "10px")
                ).append(
                    $("<p>").text(display.replaceAll("\n","")).css("display", "inline-block").css("margin", "0").css("width", "100%")
                )
            );
            lines = lines.concat($("<br>"));
        } else if(splitIntoTags[i].startsWith("list")) {
            var og = splitIntoTags[i];
            
            var toAdd;
            if(og.includes("n")) {
                toAdd = $("<ol>");
            } else {
                toAdd = $("<ul>");
            }

            while(splitIntoTags[++i].replaceAll("\n", "<br>") != "tsil") {
                var els = processText(splitIntoTags[i].replaceAll("\n", ""), splitterLevel+1);
                var toapp = $("<li>").append();
                els.forEach((el) => {
                    if(typeof el == "object") toapp.append(el);
                    else toapp.append(document.createTextNode(el))
                });
                toAdd.append(
                    toapp
                )
            }

            lines = lines.concat(toAdd);
        } else {
            splitIntoTags[i] = splitIntoTags[i].replaceAll("\n\n", "<br><br>");
            lines = lines.concat(splitIntoTags[i]);
        }
    }
    if(splitterLevel == 0) {
        for(var i = 0; i < lines.length; i++) {
            if(typeof lines[i] == "object") { // jQuery element
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
                    $("#textcontain").append(el);
                });
            }

            $("#textcontain").append($("<br>")).append($("<br>"));
            $("#textcontain").append($("<br>")).append($("<br>"));
        }
        
    } else {
        if(stringify) {
            var toReturn = [];
            lines.forEach((line) => {
                if(typeof line == "object") toReturn = toReturn.concat(line);
                else                        toReturn = toReturn.concat(document.createTextNode(line));
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
    //console.log(data);

    if(data.type != "page") return;
    if(!data.success) {
        $("#pageTitleLabel").text("404 Page not found");
        return;
    }
    
    if(data.subtopics.length > 0) {
        data.subtopics.forEach(element => {
            createSubtopicElement(element);
        });
    } else {
        $("#subtopicsOuterContainer").css("display", "none");
    }

    $("#pageTitleLabel").text(data.fancyName);
    $("#pageSubtitleLabel").text(data.description);

    $("#parentLink").append(document.createTextNode(" > "));

    var buildingLink = "/topics/";
    var iii = 0;
    data.stackTrace.forEach((el) => {
        buildingLink += data.stackTraceUrls[iii++] + "/";
        $("#parentLink").append($("<a>").text(el).attr("href", buildingLink));
        $("#parentLink").append(document.createTextNode(" > "));
    });

    $("#parentLink").append(document.createTextNode(data.fancyName));

    footnotes = [];
    processText(data.fullText);

    if(data.scrollToId != "") {
        if($("#ScrollId" + data.scrollToId).length) {
            $("#ScrollId" + data.scrollToId).get(0).scrollIntoView();
            var splitUrl = window.location.href.split("/");
            splitUrl.pop();
            splitUrl.pop();
            window.history.pushState(null, "", splitUrl.join("/") + "/");
        }
    }

    $(document).prop("title", data.fancyName + " - SBEST");

    MathJax.typesetPromise();

    $("#loadingOverlay").remove();
}