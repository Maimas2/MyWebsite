function parseRowData(data) {
    data.forEach((row) => {
        let toAdd = $("<tr>")

        toAdd.append(
            $("<th>").append(
                $("<a>").text(row.text || "null").attr("href", `/quote/${row.id}`)
            )
        )
        toAdd.append(
            $("<th>").append(
                $("<a>").text(row.person || "null").attr("href", `/person/${row.person}`)
            )
        )
        toAdd.append(
            $("<th>").text(row.location || "null")
        )
        toAdd.append(
            $("<th>").text(row.audience || "null")
        )
        toAdd.append(
            $("<th>").text("Not yet")
        )
        toAdd.append(
            $("<th>").text(row.source || "null")
        )

        $("#rowElement").append(toAdd)
    });
}

window.onload = function () {
    let d = {};
    $.ajax({
        url: "/api/getquotes",
        method: "GET",
        data: JSON.stringify(d),
        success: function (data) {
            parseRowData(data.rows);
        }
    })
};