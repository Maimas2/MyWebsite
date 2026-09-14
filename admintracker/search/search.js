function titleCase(s, splitter = "_") {
    return s.split(splitter).map(word => word.length ? word[0].toUpperCase() + word.slice(1) : "").join(" ");
}

function parseRowData(data) {
    if (!data) if (window.location.pathname.split("/").includes("people")) {
        $("#uhOhH2").text("Person not found...");
    } else if (window.location.pathname.split("/").includes("tag")) {
        $("#uhOhH2").text("Tag not found...");
    } else {
        $("#uhOhH2").text("No results found...");
    }
    $("#rowElement").children("tr").remove();
    if (data.length == 0) {
        $("#searchResults").css("display", "none");
        if (window.location.pathname.split("/").includes("people")) {
            $("#uhOhH2").text("Person not found...");
        } else {
            $("#uhOhH2").text("No results found...");
        }
        return;
    }
    data.forEach((row) => {
        let toAdd = $("<tr>");

        toAdd.append(
            $("<th>").append(
                $("<a>").text(row.text || "null").attr("href", `/${row.type.toLowerCase()}/${row.id}`)
            )
        );

        toAdd.append(
            $("<th>").append(
                $("<p>").text(row.type)
            )
        );

        if (true || !window.location.pathname.split("/").includes("people")) toAdd.append(
            $("<th>").append(
                $("<a>").text(row.person || "null").attr("href", `/people/${row.person}`)
            )
        );

        toAdd.append(
            $("<th>").text(row.location || "null")
        );

        toAdd.append(
            $("<th>").text(row.audience || "null")
        );

        let tagsPart = $("<th>");
        row.tags.split(",").forEach((tag) => {
            tagsPart.append(
                $("<a>").addClass("tagLink innerTagLink").text(titleCase(tag)).attr("href", `/tag/${tag}`).attr("data-ogtag", tag).on("click", function(e) {
                    if (e.shiftKey) {
                        e.preventDefault();
                        addTagToSearch($(this).attr("data-ogtag"));
                    }
                })
            );
        });
        toAdd.append(tagsPart);

        toAdd.append(
            $("<th>").append(
                $("<a>").text((row.source || "null").split("/").slice(0, 3).join("/") + "/").attr("href", row.source)
            )
        );

        $("#rowElement").append(toAdd);
    });

    $("#searchResults").css("display", "table");
    $("#uhOhH2").text("");
}

function doSearch(settingUp = false) {
    let d = {

    };
    let url = "/api/searchitems";

    if ($("#searchContents").val()) d.quotetext = $("#searchContents").val();
    if ($("#searchPerson").val()) d.person = $("#searchPerson").val();
    if ($("#containedTagSearch").children(".tagLink").length) d.taglist = $("#containedTagSearch").children(".tagLink").toArray().map((el) => $(el).attr("data-ogtag"));

    if (window.location.pathname.split("/").includes("people")) {
        let toPush = `/people/${$("#searchPerson").val()}`;
        if (!$("#searchPerson").val().length) toPush = "/search/";
        if (window.Location.pathname != toPush) history.pushState(null, "", toPush);

        d.person = decodeURI(window.location.pathname.split("/").pop());

        $("#mainH2").text("Quotes from " + decodeURI(window.location.pathname.split("/").pop()));

        // $("#searchPerson").css("display", "block");
        //$("#personTh").css("display", "none");
    } else if (window.location.pathname.split("/").includes("tag")) {
        d.taglist = $("#containedTagSearch").children(".tagLink").toArray().map((el) => $(el).attr("data-ogtag"));

        if (d.taglist.length == 0) return; // Refuse to search on empty taglist

        if (window.Location.pathname != `/tag/${d.taglist.join(",")}`) history.pushState(null, "", `/tag/${d.taglist.join(",")}`);

        $("#mainH2").text("Quotes tagged " + decodeURI(window.location.pathname.split("/").pop()).split(",").map((w) => titleCase(w, " ")).join(", "));

        // $("#searchTags").css("display", "block");
    } else if (false) { // For other pre-defined types of search

    } else { // Other tasks only needed on /search page
        $(".searchBar").css("display", "block");

        $("#mainH2").text("Search");
    }

    if (settingUp) return; // Don't make any requests on run on page load

    // console.log(d);

    $.ajax({
        url: url,
        method: "POST",
        data: d,
        success: function(data) {
            parseRowData(data.rows);
        }
    });
}

function refreshUrlTagWise() {
    let tags = $("#containedTagSearch").children(".tagLink").toArray().map((el) => $(el).attr("data-ogtag"));

    let urlToPush = `/tag/${tags.join(",")}`;

    if (!tags.length) {
        urlToPush = "/search/";
    }
    if (window.Location.pathname != urlToPush) history.pushState(null, "", urlToPush);
}

window.onload = function() {
    if (window.location.pathname.split("/").includes("people")) {
        // $(".generalSearchOnly").css("display", "none");
        $("#searchPerson").val(decodeURI(window.location.pathname.split("/").pop()));
        // $("#searchTags").css("display", "block");
    } else if (window.location.pathname.split("/").includes("tag")) {
        // $(".generalSearchOnly").css("display", "none");

        window.location.pathname.split("/").pop().split(",").forEach((tag) => {
            addTagToSearch(tag);
        });

        // $("#searchPerson").css("display", "block");
        // $("#searchTags").css("display", "block");
    }

    doSearch(false);

    $(".enterToSearch").on("submit", function() {
        doSearch();
    });
    $("#searchTags").on("input", function() { // Deal with tag search prompts
        let d = {
            tagFragment: $(this).val()
        };
        $.ajax({
            url: "/api/searchtags",
            method: "POST",
            data: d,
            success: function(data) {
                $("#tagSearchPrompts").children().remove();
                if (!data.bestGuesses) return;
                let tagsAlreadyShown = $("#containedTagSearch").children(".tagLink").toArray().map((el) => $(el).attr("data-ogtag"));
                // ^ Filter out the tags already selected
                data.bestGuesses.forEach((g) => {
                    if (tagsAlreadyShown.includes(g)) return;
                    $("#tagSearchPrompts").append(
                        $("<button>").attr("data-ogtag", g).text(titleCase(g)).addClass("tagSearchPrompt").on("click", function() {
                            $("#searchTags").val($(this).attr("data-ogtag"));
                            flushTagSearch();
                        })
                    );
                });
            }
        });
    });
    $("#searchPerson").on("input", function() { // Deal with person search prompts
        let d = {
            personFragment: $(this).val().toLowerCase()
        };
        $.ajax({
            url: "/api/searchpeople",
            method: "POST",
            data: d,
            success: function(data) {
                $("#personSearchPrompts").children().remove();
                if (!data.bestGuesses) return;

                data.bestGuesses.forEach((g) => {
                    $("#personSearchPrompts").append(
                        $("<button>").attr("data-ogtag", g).text(g).addClass("tagSearchPrompt").on("click", function() {
                            $("#searchPerson").val($(this).text());
                            $("#personSearchPrompts").children().remove();
                        })
                    );
                });
            }
        });
    });
    $("#searchButton").on("click", function() {
        doSearch();
    });
};

function addTagToSearch(tag) {
    $("#containedTagSearch").append(
        $("<p>").addClass("tagLink").text(titleCase(tag.replaceAll(" ", "_"))).attr("data-ogtag", tag.toLowerCase().replaceAll(" ", "_")).on("click", function() {
            $(this).remove();
            refreshUrlTagWise();
        })
    );
}

function flushTagSearch() {
    addTagToSearch($("#searchTags").val());

    $("#tagSearchPrompts").children().remove();
    $("#searchTags").val("");
    $("#searchTags").focus();
}

document.onkeydown = (e) => {
    if (e.key == "Enter") {
        if ($(":focus").hasClass("enterToSearch")) {
            doSearch();
        } else if ($(":focus").attr("id") == "searchTags") {
            if ($("#tagSearchPrompts").children(".tagSearchPrompt").length) {
                $("#tagSearchPrompts").children(".tagSearchPrompt")[0].click();
            } else {
                doSearch();
            }
        }
    }
};