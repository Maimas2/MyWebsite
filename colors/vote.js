// Uses iro.js under the MPLv2

var idCount = 0;

function rgbToCmyk(r, g, b) {
    let c = 1 - r;
    let m = 1 - g;
    let y = 1 - b;

    let k = Math.min(c, m, y);

    const len = 3;

    if(k == 1) return "0, 0, 0, 1"

    else return `${c.toFixed(len)}, ${m.toFixed(len)}, ${y.toFixed(len)}, ${k.toFixed(len)}`;
}

function createNew() {
    let tidc = idCount;

    var toAppend = $("<div>").addClass(`colorContainer cc${idCount}`).attr("data-num", idCount);

    $("#colorContainerContainer").append(toAppend);

    var controls = $("<div>").attr("id", `controls${tidc}`);

    toAppend.append( $("<div>").addClass(`colorBox cbox${idCount}`).attr("data-isshown", "true").on("click", function() {
        if($(this).attr("data-isshown") == "true") {
            $(`#controls${tidc}`).css("display", "none");
            $(this).attr("data-isshown", "false");
            $(this).parent().css("width", "75px");
            $(this).parent().css("height", "100%");
        } else {
            $(`#controls${tidc}`).css("display", "");
            $(this).attr("data-isshown", "true");
            $(this).parent().css("width", "");
            $(this).parent().css("height", "");
        }
    }) );

    toAppend.append(controls);

    $("#previewColorContainer").append( $("<div>").addClass(`cbox${idCount}`) );

    controls.append( $("<div>").addClass("cPicker nonPreview").prop("id", `picker${idCount}`) );

    controls.append( $("<input>").prop("type", "text").addClass("nonPreview").prop("id", `hlabel${idCount}`).text("gh4i").on("change", function(_e) {
        let v = $(this).val();
        if(v.startsWith("#") && !isNaN(v.substr(1).replaceAll("a","").replaceAll("b","").replaceAll("c","").replaceAll("d","").replaceAll("e","").replaceAll("f",""))) {
            colorPicker.color.hexString = v;
        } else if(!v.startsWith("#") && !isNaN(v.substr(1).replaceAll("a","").replaceAll("b","").replaceAll("c","").replaceAll("d","").replaceAll("e","").replaceAll("f",""))) {
            colorPicker.color.hexString = "#" + v;
        } else {
            $(this).val(colorPicker.color.hexString);
        }
    }) );

    let tdiv = $("<div>");

    tdiv.append( $("<input>").prop("type", "text").addClass("nonPreview").prop("id", `rlabel${idCount}`).text("gh4i").on("change", function(_e) {
        if(!isNaN($(this).val())) colorPicker.color.red = $(this).val();
        else $(this).val(colorPicker.color.red);
    }) );
    tdiv.append( $("<input>").prop("type", "text").addClass("nonPreview").prop("id", `glabel${idCount}`).text("gh4i").on("change", function(_e) {
        if(!isNaN($(this).val())) colorPicker.color.green = $(this).val();
        else $(this).val(colorPicker.color.green);
    }) );
    tdiv.append( $("<input>").prop("type", "text").addClass("nonPreview").prop("id", `blabel${idCount}`).text("gh4i").on("change", function(_e) {
        if(!isNaN($(this).val())) colorPicker.color.blue = $(this).val();
        else $(this).val(colorPicker.color.blue);
    }) );

    controls.append(tdiv);
    
    controls.append( $("<p>").css("display", "inline").css("margin", "5px").prop("type", "text").addClass("nonPreview").prop("id", `cmyklabel${idCount}`).text("gh4i") );

    controls.append($("<br>"));

    controls.append(
        $("<button>").on("click", function() {
            $(`.cc${$(this).parent().attr("data-num")}`).remove();
            $(`.cbox${$(this).parent().attr("data-num")}`).remove()
        }).text("Remove").css("margin-bottom", "5px")
    );


    let colorPicker = new iro.ColorPicker(`#picker${idCount}`, {
        color: "#f00",
        layoutDirection: "vertical",
        padding: 0,
        width: 300,
        layout: [
            {
                component: iro.ui.Wheel
            },
            {
                component: iro.ui.Slider,
                options: {
                    sliderType: "red"
                }
            },
            {
                component: iro.ui.Slider,
                options: {
                    sliderType: "green"
                }
            },
            {
                component: iro.ui.Slider,
                options: {
                    sliderType: "blue"
                }
            },
        ]
    });

    colorPicker.on(['color:init', 'color:change'], function(color) {
        $(`.cbox${tidc}`).css("background-color", color.rgbString);
        $(`#hlabel${tidc}`).val(`${color.hexString}`);
        $(`#rlabel${tidc}`).val(`${color.red}`);
        $(`#glabel${tidc}`).val(`${color.green}`);
        $(`#blabel${tidc}`).val(`${color.blue}`);
        $(`#cmyklabel${tidc}`).text(rgbToCmyk(color.red / 255, color.green / 255, color.blue / 255));
    });

    idCount++;
}

$("#previewColorContainer").sortable({
    animation : 150
});
$("#colorContainerContainer").sortable({
    animation : 150,
    handle: ".colorBox"
});

createNew();
createNew();