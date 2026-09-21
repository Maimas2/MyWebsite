function titleCase(s, splitter = "_") {
    return s.split(splitter).map(word => word.length ? word[0].toUpperCase() + word.slice(1) : "").join(" ");
}

function parseRowData(data) {
    data.forEach((row) => {
        let toAdd = $("<tr>");

        toAdd.attr("data-ogjson", JSON.stringify(row));

        toAdd.append(
            $("<th>").text(row.id || "null")
        );

        toAdd.append(
            $("<th>").append(
                $("<a>").text(row.text || "null").attr("href", `/admin/item/${row.id}`)
            ).append(
                $("<br>")
            ).append(
                $("<br>")
            ).append(
                $("<a>").text("(Non-Admin Page)").attr("href", `/item/${row.id}`)
            )
        );
        toAdd.append(
            $("<th>").append(
                $("<a>").text(row.person || "null").attr("href", `/people/${row.person}`)
            )
        );
        toAdd.append(
            $("<th>").text(row.description || "null")
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
        toAdd.append(
            $("<th>").append(
                $("<a>").text((row.archivedsource || "null").split("/").slice(0, 3).join("/") + "/").attr("href", row.archivedsource)
            )
        );
        if (window.location.href.split("/").pop() == "proposed_items") {
            toAdd.append(
                $("<th>").css("padding-top", 0).append(
                    $("<button>").text("Approve").on("click", function() {
                        let toSend = JSON.parse($(this).parent().parent().attr("data-ogjson"));

                        $(this).parent().parent().css("background-color", "#bbb");
                        $(this).parent().parent().find("button").prop("disabled", true);

                        let toRemove = $(this).parent().parent();

                        $.ajax({
                            url: "/api/admin/approveproposeditem",
                            type: "POST",
                            data: toSend,
                            success: function(e) {
                                toRemove.remove();
                                $("#actionMessage").html(`<a href="${e.newUrl}">Successfully approved quote</a>`);
                            },
                            error: function(e) {
                                console.log(e);
                                $("#actionMessage").text(e);
                                $(this).parent().parent().css("background-color", "");
                                $(this).parent().parent().find("button").prop("disabled", false);
                            }
                        });
                    })
                ).append(
                    $("<button>").text("Reject")
                )
            );
        }

        $("#rowElement").append(toAdd);
    });
    if (window.location.href.split("/").pop() == "proposed_items") {
        $("#idTh").remove();
        $("#theadTr").append(
            $("<th>").text("Actions")
        );
    }
}

window.onload = function() {
    let d = {};
    $("#headerH2").text(`Explore sys.${window.location.href.split("/").pop()}`);
    $.ajax({
        url: `/api/admin/fetchexplore/${window.location.href.split("/").pop()}`,
        method: "POST",
        data: JSON.stringify(d),
        success: function(data) {
            console.log(data);
            parseRowData(data);
        }
    });
};