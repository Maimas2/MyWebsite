// Uses iro.js under the MPLv2

var idCount = 0;

const cmykRegex = /cmyk\(\d{1,3}(\.\d)?\%, *\d{1,3}(\.\d)?\%, *\d{1,3}(\.\d)?\%, *\d{1,3}(\.\d)?\%\)/;
const rgbHexRegex = /^\#((\d|[a-f]){3})((\d|[a-f]){3})?$/;

function rgbToCmyk(r, g, b) {
    let c = 1 - r;
    let m = 1 - g;
    let y = 1 - b;

    let k = Math.min(c, m, y);

    c = (c - k) / (1 - k);
    m = (m - k) / (1 - k);
    y = (y - k) / (1 - k);

    const len = 1;

    if(k == 1) return "cmyk(0%, 0%, 0%, 100%)"

    else return `cmyk(${(c*100).toFixed(len)}%, ${(m*100).toFixed(len)}%, ${(y*100).toFixed(len)}%, ${(k*100).toFixed(len)}%)`;
}

function cmykToRgb(c, m, y, k) {
    let tArray = [Math.round(255*(1 - c)*(1 - k)), Math.round(255*(1 - m)*(1 - k)), Math.round(255*(1 - y)*(1 - k))];
    return `#${(tArray[0] < 16 ? "0" : "") + tArray[0].toString(16)}${(tArray[1] < 16 ? "0" : "") + tArray[1].toString(16)}${(tArray[2] < 16 ? "0" : "") + tArray[2].toString(16)}`
}

function createNew(initialColor = "#f00") {
    let tidc = idCount;

    var toAppend = $("<div>").addClass(`colorContainer cc${idCount}`).attr("data-num", idCount);

    $("#colorContainerContainer").append(toAppend);

    var controls = $("<div>").attr("id", `controls${tidc}`);

    toAppend.append( $("<div>").addClass(`colorBox cbox${idCount}`).attr("data-isshown", "true").on("click", function() {
        if($(this).attr("data-isshown") == "true") {
            $(`#controls${tidc}`).css("display", "none");
            $(this).attr("data-isshown", "false");
            $(this).parent().css("width", "75px");
            $(this).parent().css("height", "650");
            $(this).css("height", "650");
        } else {
            $(`#controls${tidc}`).css("display", "");
            $(this).attr("data-isshown", "true");
            $(this).parent().css("width", "");
            $(this).parent().css("height", "");
            $(this).css("height", "");
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

    tdiv.append( $("<input>").prop("type", "text").addClass("rlabel").prop("id", `rlabel${idCount}`).text("gh4i").on("change", function(_e) {
        if(!isNaN($(this).val())) colorPicker.color.red = $(this).val();
        else $(this).val(colorPicker.color.red);
    }) );
    tdiv.append( $("<input>").prop("type", "text").addClass("glabel").prop("id", `glabel${idCount}`).text("gh4i").on("change", function(_e) {
        if(!isNaN($(this).val())) colorPicker.color.green = $(this).val();
        else $(this).val(colorPicker.color.green);
    }) );
    tdiv.append( $("<input>").prop("type", "text").addClass("blabel").prop("id", `blabel${idCount}`).text("gh4i").on("change", function(_e) {
        if(!isNaN($(this).val())) colorPicker.color.blue = $(this).val();
        else $(this).val(colorPicker.color.blue);
    }) );

    controls.append(tdiv);
    
    controls.append( $("<p>").css("display", "inline").css("margin", "5px").prop("type", "text").addClass("nonPreview").prop("id", `cmyklabel${idCount}`).text("gh4i").addClass("cmyklabel") );

    controls.append($("<br>"));

    controls.append(
        $("<button>").addClass("removeButton").on("click", function() {
            $(`.cc${$(this).parent().parent().attr("data-num")}`).remove();
            $(`.cbox${$(this).parent().parent().attr("data-num")}`).remove();
        }).text("Remove").css("margin-bottom", "5px")
    );


    let colorPicker = new iro.ColorPicker(`#picker${idCount}`, {
        color: initialColor,
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
                    sliderType: "value"
                }
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

$("#copyRGB").on("click", function() {
    var toReturn = "";
    $(".cmyklabel").each(function(_e) {
        if(toReturn != "") toReturn += " ";
        let r = Number($(".rlabel").get(_e).value);
        let g = Number($(".glabel").get(_e).value);
        let b = Number($(".blabel").get(_e).value);
        console.log(b<16)
        toReturn += `#${(r < 16 ? "0" : "") + r.toString(16)}${(g < 16 ? "0" : "") + g.toString(16)}${(b < 16 ? "0" : "") + b.toString(16)}`;
    });
    if(confirm("Ok to copy the following string?\n" + toReturn)) navigator.clipboard.writeText(toReturn);
});
$("#copyCMYK").on("click", function() {
    var toReturn = "";
    $(".cmyklabel").each(function(_e) {
        if(toReturn != "") toReturn += "\n";
        toReturn += $(this).text();
    });
    if(confirm("Ok to copy the following string?\n" + toReturn)) navigator.clipboard.writeText(toReturn);
});

$("#importRGB").on("click", function() {
    var raw = prompt("Enter your RGB values. Note that this will replace ALL colors currently configured.");
    console.log(raw);
    if(raw != null) {
        var split = raw.split(" ");

        $(".removeButton").click();

        for(l in split) {
            console.log(split[l])
            if(rgbHexRegex.test(split[l])) {
                createNew(split[l]);
            }
        }
    }
});

$("#importCMYK").on("click", function() {
    var raw = prompt("Enter your CMYK values. Note that this will replace ALL colors currently configured.");
    console.log(raw);
    if(raw != null) {
        var split = raw.split(")");
        console.log(split);

        $(".removeButton").click();

        for(l in split) {
            if(cmykRegex.test(split[l] + ")")) {
                var split2 = split[l].split(",");
                let tArray = [];
                split2.forEach((e) => {
                    tArray.push(Number(e.replaceAll("cmyk(", "").replaceAll("%", "").trim())/100);
                });
                console.log(cmykToRgb(tArray[0], tArray[1], tArray[2], tArray[3]));
                createNew(cmykToRgb(tArray[0], tArray[1], tArray[2], tArray[3]));
            }
        }
    }
});

createNew("#00f");
createNew("#ff0");
