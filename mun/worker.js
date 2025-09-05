// Licensed under GPLv3

// Mmm spaghetti and meatballs

// Libraries used:
// - ExpressJS
// - SortableJS
// - jQuery
// - body-parser
// - jQuery-sortablejs
// - vHost


var basicListOfCountries = new Array("Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei Darussalam", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Ivory Coast", "Croatia", "Cuba", "Cyprus", "Czechia", "North Korea", "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Republic of Korea", "Republic of Moldova", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syrian Arab Republic", "Tajikistan", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Türkiye", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United Republic of Tanzania", "United States of America", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe", "Holy See");

var customDelegates = new Array(
    
);

function getListOfCountries() {
    return basicListOfCountries.concat(customDelegates);
}

function getDictOfVotingCountries() {
    var toReturn = {};
    listOfCountriesInCommittee.forEach(function(v) {
        if($("#attendanceNode" + sanitizeForID(v)).length && $("#attendanceNode" + sanitizeForID(v)).css("display") != "none") {
            var buttons = document.getElementById("attendanceNode" + sanitizeForID(v)).getElementsByTagName("button");
            if(buttons[1].getAttribute("data-clicked") == "true") {
                toReturn[v] = "Pr";
            } else if(buttons[2].getAttribute("data-clicked") == "true") {
                toReturn[v] = "Pr&V";
            } else {
                toReturn[v] = "Ab";
            }
        }
    });
    return toReturn;
}

function getListOfVotingCountries() {
    var d = getDictOfVotingCountries();
    var toReturn = [];
    Object.keys(d).forEach(function(el) {
        if(d[el] != "Ab") toReturn.push(el);
    });
    return toReturn;
}

var listOfCountriesInCommittee = []; // Only labelled as in committee, not necessarily present
var numDelegatesInCommittee = 0;     // Length of above; should be *mostly* unused

var isPopupShown = false;

var currentMotion = null;

var largeTimerCurrentTime = 0;      // Current display time in seconds. No fractional part.
var isLargeTimerGoing = false;      // Whether the timer is currently going
var largeTimerOriginalDuration = 0; // In mods, the original duration, not per delegate
var largeTimerNumDelegates = 0;     // Number of delegates that will speak

var perDelegateCurrentPosition = 1; // Number delegate of the speakers in the mod

var canSortChosenCountries = true;

var isTimerHalted = false;

var hidingAlertInterval;
var hidingPopupInterval;

var rollCallCurrentVoter = 0;
var numPossibleVoters    = 0;
var rollCallNumYeas      = 0;
var rollCallNumNays      = 0;
var rollCallNumAbstains  = 0;
var rollCallCurrentVotes = [];

var isInQuickStart = false;

var hasMadeNewDelegate = false;

function sanitizeForID(id) {
    return id.replaceAll(" ", "").replaceAll("'", "").replaceAll(".", "").replaceAll("#", "");
}

function getDelegatePresenseNodes() {
    return $("#normalDelegateList > div").toArray().concat($("#customDelegateList > div").toArray());
}

function refreshPresentDelegateList() {
    numDelegatesInCommittee = 0;
    listOfCountriesInCommittee = [];
    getDelegatePresenseNodes().forEach((e) => {
        if(typeof e.getAttribute != "undefined") {
            if(!$(e).children().length) return;
            var isc = $(e).children().get(0).getAttribute("data-isclicked") == "true";
            if(isc) {
                numDelegatesInCommittee++;
                $("#attendanceNode" + sanitizeForID(e.textContent)).css("display", "block");

                listOfCountriesInCommittee.push(e.textContent);
            } else {
                $("#attendanceNode" + sanitizeForID(e.textContent)).css("display", "none");
            }
        }
    });
}

function recalcDelegates() {
    refreshPresentDelegateList();

    var voters = getListOfVotingCountries().length;
    $("#numberOfDelegates").text(voters + " Delegate" + (voters == 1 ? "" : "s"));
    $("#simpleMajorityLabel").text(`${Math.ceil((voters+0.1)/2)}/${voters}`);
    $("#twoThirdsLabel").text(`${Math.ceil(voters*2/3)}/${voters}`);
    if(voters == 0) {
        document.getElementById("simpleMajorityLabel").textContent = "0/0";

        $("#newSpeakersList").prop("disabled", true);
        $("#newMod").prop("disabled", true);
        $("#newRoundRobin").prop("disabled", true);
        $("#commenceRollCall").prop("disabled", true);
    } else {
        $("#newSpeakersList").prop("disabled", false);
        $("#newMod").prop("disabled", false);
        $("#newRoundRobin").prop("disabled", false);
        $("#commenceRollCall").prop("disabled", false);
    }

    if(numDelegatesInCommittee == 0) {
        $("#takeAttendanceButton").prop("disabled", true);
    } else {
        $("#takeAttendanceButton").prop("disabled", false);
    }
}

function showPopup() {
    if(!isPopupShown) {
        document.getElementById("popupPage").childNodes.forEach(function(element) {
            if(typeof element.style != "undefined") {
                element.style.display = "none";
            }
        });

        $("#popupPage").css("opacity", "0");
        $("#popupPage").css("display", "block");
        $("#popupPage").css("top", "0");
        $("#popupPage").css("height", "100%");
        $("#exitPopup").css("display", "inline");
        $("#popupPage").css("user-select", "");

        $("#quitPopup").text("Discard");

        $("#popupPage").animate({
            opacity : 1
        }, 150);

        $("#quitPopup").css("display", "");

        isPopupShown = true;
    }
}

function resortMotions() {
    if(isMirroring) return;
    var listedMotions = $("#motiondisplays").children().get();
    listedMotions.sort(function(first, second) {
        return motionTypeToImportance(first) < motionTypeToImportance(second);
    });
    $.each(listedMotions, function(first, second) {
        $("#motiondisplays").append(second);
    });

    resendMirror();
}

function appendMotion(m) {
    if($("#firstMotionPrompt").length) $("#firstMotionPrompt").remove();

    if(isMirroring) {
        m.find("input").toArray().forEach((el) => {
            $(el).replaceWith($("<span>").append(document.createTextNode(el.value)));
        });

        m.find("button").remove();
    } else {
        m.find("input").toArray().forEach(function(el) {
            $(el).on("change", resortMotions);
        });
    }

    m.attr("id", "");
    m.attr("data-rngid", Math.floor(Math.random()*10000).toString()); // Random id to add to keep track of motions that otherwise are identical, esp. for saving/restoring state

    m.appendTo("#motiondisplays");

    if(!isMirroring) {
        var ph = m.css("height");
        var pp = m.css("padding");
        var pmt = m.css("margin-top");
        var pmb = m.css("margin-bottom");

        m.css("opacity", "0");

        m.css("height", "0");
        m.css("padding", "0");
        m.css("margin-top", "0");
        m.css("margin-bottom", "0");

        m.css("min-height", "0");

        m.animate({
            opacity : 1,
            height : ph,
            padding : pp,
            "margin-top" : pmt,
            "margin-bottom" : pmb
        }, 150, function(_e) {
            m.css("min-height", "");
        });
    } else {
        var ph = m.css("height");
        var pp = m.css("padding");
        var pmt = m.css("margin-top");
        var pmb = m.css("margin-bottom");

        m.css("height", ph);
        m.css("padding", pp);
        m.css("margin-top", pmt);
        m.css("margin-bottom", pmb);
    }

    resortMotions();
}

function addAttendanceNodes() {
    getListOfCountries().forEach(function(v) {
        if(!typeof v == "string") return;
        var cont = $("#attendanceButtonsPrefab").clone(true);
        cont.children("p").get(0).textContent = v;
        cont.attr("id", "attendanceNode" + sanitizeForID(v));
        cont.children("button").get(0).click();

        $("#attendanceListOfCountries").append(cont);
    });
}

function refreshAttendanceNodes() {
    let t = getDictOfVotingCountries();
    $("#attendanceListOfCountries > *").remove();
    addAttendanceNodes();
    implementAttendanceList(t);
}

function implementAttendanceList(att) {
    $("#attendanceListOfCountries > *").css("display", "none");
    listOfCountriesInCommittee.forEach(function(el) {
        $("#attendanceNode" + sanitizeForID(el)).css("display", "block");
    });
    Object.keys(att).forEach((country) => {
        var tan = $("#attendanceNode" + sanitizeForID(country));
        if(att[country] == "Pr") {
            tan.children("button").get(1).click();
        } else if(att[country] == "Pr&V") {
            tan.children("button").get(2).click();
        }
    });
}

function isTimeInvalid(s) {
    return !((!isNaN(s.replaceAll(":","").replaceAll(" ", ""))) && s != "")
}

function hidePopup(nextFunction = null) {
    var quickStartKeyToGoOn = 0; /**
    * 0: Do nothing
    * 1: Delegate list done, go back to start
    * 2: Attendance done, exit out
    */
    if(isPopupShown) {
        if(document.getElementById("newModPopup").style.display != "none") { // Check if inputs are valid
            if(isTimeInvalid($("#newModPopupDuration").val())) {
                createAlert("Invalid duration");
                return
            }
            if(stringToDuration($("#newModPopupDuration").val()) <= 0) {
                createAlert("Duration can't be zero");
                return;
            }
            if(isTimeInvalid($("#newModPopupDelegateDuration").val())) {
                createAlert("Invalid delegate duration");
                return
            }
            if(stringToDuration($("#newModPopupDelegateDuration").val()) <= 0) {
                createAlert("Duration can't be zero");
                return;
            }
            if(Math.floor( stringToDuration($("#newModPopupDuration").val()) / stringToDuration($("#newModPopupDelegateDuration").val()) ) > getListOfVotingCountries().length) {
                createAlert("You don't have enough delegates in committee to make such a mod");
                return;
            }
        } else if(document.getElementById("newUnmodPopup").style.display != "none") {
            if(isTimeInvalid($("#newUnmodPopupDuration").val())) {
                createAlert("Invalid duration");
                return;
            }
            if(stringToDuration($("#newUnmodPopupDuration").val()) <= 0) {
                createAlert("Duration can't be zero");
                return;
            }
        } else if(document.getElementById("speakersListPopup").style.display != "none") {
            if(isTimeInvalid($("#speakersListNumDelegates").val()) || Number($("#speakersListNumDelegates").val()) <= 0) {
                createAlert("Invalid number of delegates");
                return;
            }
            if(isTimeInvalid($("#speakersListPopupDelegateDuration").val())) {
                createAlert("Invalid delegate duration");
                return;
            }
            if(stringToDuration($("#speakersListPopupDelegateDuration").val()) <= 0) {
                createAlert("Duration can't be zero");
                return;
            }
            if($("#speakersListNumDelegates").val() > getListOfVotingCountries().length) {
                createAlert("You don't have enough delegates in committee to open such a speakers list");
                return;
            }
        } else if(document.getElementById("roundRobinPopup").style.display != "none") {
            if(isTimeInvalid($("#roundRobinDelegateDuration").val())) {
                createAlert("Invalid duration");
                return;
            }
            if(stringToDuration($("#roundRobinDelegateDuration").val()) <= 0)
            createAlert("Duration can't be zero");
        } else if($("#attendanceList").css("style") != "none") {
            recalcDelegates();
        }

        if(document.getElementById("editDelegateList").style.display != "none") {
            recalcDelegates();
            
            refreshAttendanceNodes();

            if(isInQuickStart) {
                if(numDelegatesInCommittee == 0) {
                    createAlert("Choose some delegates to be in your committee first");
                    return;
                } else {
                    quickStartKeyToGoOn = 1;
                }
            }

            resendMirror();
        } else if(document.getElementById("newModPopup").style.display != "none") {
            var toAdd = $("#modMotionPrefab").clone(true);
            var inputList = toAdd.find("input");
            inputList[0].value = $("#newModTopic").val();
            inputList[1].value = $("#newModPopupDuration").val();
            inputList[2].value = $("#newModPopupDelegateDuration").val();

            appendMotion(toAdd);
        } else if(document.getElementById("newUnmodPopup").style.display != "none") {
            var toAdd = $("#unmodMotionPrefab").clone(true);
            var inputList = toAdd.find("input");
            inputList[0].value = $("#newUnmodTopic").val();
            inputList[1].value = $("#newUnmodPopupDuration").val();

            appendMotion(toAdd);
        } else if(document.getElementById("speakersListPopup").style.display != "none") {
            var toAdd = $("#speakersListMotionPrefab").clone(true);
            var inputList = toAdd.find("input");
            inputList[0].value = $("#speakersListNumDelegates").val();
            inputList[1].value = $("#speakersListPopupDelegateDuration").val();

            appendMotion(toAdd);
        } else if(document.getElementById("roundRobinPopup").style.display != "none") {
            var toAdd = $("#roundRobinMotionPrefab").clone(true);
            var inputList = toAdd.find("input");
            inputList[0].value = $("#roundRobinTopic").val();
            inputList[1].value = $("#roundRobinDelegateDuration").val();

            appendMotion(toAdd);
        }

        if(quickStartKeyToGoOn == 1) {
            nextFunction = function() {
                showQuickStart();
                $("#quickStartDelegates").prop("disabled", true);
                $("#quickStartAttendance").prop("disabled", false);
            };
        }

        quitPopup(nextFunction);
    }
}

function quitPopup(nextFunction = null) {
    if(isPopupShown) {
        isPopupShown   = false;
        isInQuickStart = false;

        $("#popupPage").animate({
            opacity : 0
        }, 150, (_e) => {
            $("#popupPage").css("display", "none");
            $("#popupPage > *").css("display", "none");
            $("#popupPage").css("user-select", "none");

            if(nextFunction != null) nextFunction();

            resendMirror();
        });

        $(":focus").blur();

        lastSent = -1000;
    }
}

function killMotionDisplayParent(el) {
    var parentEl = $(el);

    parentEl.css("min-height", "0");

    parentEl.css('overflow','hidden');
    parentEl.animate({
        height : 0,
        opacity : 0,
        "margin-top" : 0,
        "margin-bottom" : 0,
        padding: 0
    }, 150, (_e) => {
        parentEl.remove();

        resendMirror();
    });
}

function killMotionDisplay(el) {
    killMotionDisplayParent(el.parentNode.parentNode.parentNode);
}

function stringToDuration(st) {
    var l = st.split(":").reverse();
    var i = 0;
    var toReturn = 0;
    for(let li of l) {
        toReturn += parseInt(li) * Math.pow(60, i++);
    }
    return toReturn;
}

function constructJSON(parentEl) {
    var ty = parentEl.getAttribute("data-motiontype");
    var building = JSON.parse("{}");

    var elementNameToGet = "input"
    if(isMirroring) elementNameToGet = "span";

    var propertyToGet = "value";
    if(isMirroring) propertyToGet = "textContent";

    building["fancyMotionTitle"] = parentEl.getElementsByTagName("h1")[0].textContent;

    if(ty == "mod") {
        building["motionType"] = "mod";
        //building["fancyMotionTitle"] = "Moderated Caucus";

        building["requiresDelegateList"] = true;
        building["timerType"] = "perDelegate";

        var inputs = parentEl.getElementsByTagName(elementNameToGet);
        building["motionTopic"] = inputs[0][propertyToGet];
        building["duration"] = stringToDuration(inputs[1][propertyToGet]);
        building["delegateDuration"] = stringToDuration(inputs[2][propertyToGet]);

        inputs[0]
    } else if(ty == "unmod") {
        building["motionType"] = "unmod";
        //building["fancyMotionTitle"] = "Unmoderated Caucus";

        building["requiresDelegateList"] = false;
        building["timerType"] = "one";

        var inputs = parentEl.getElementsByTagName(elementNameToGet);
        building["motionTopic"] = inputs[0][propertyToGet];
        building["duration"] = stringToDuration(inputs[1][propertyToGet]);
    } else if(ty == "speakersList") {
        building["motionType"] = "speakersList";
        //building["fancyMotionTitle"] = "Speakers List";

        building["motionTopic"] = "";

        building["requiresDelegateList"] = true;
        building["timerType"] = "perDelegate";

        var inputs = parentEl.getElementsByTagName(elementNameToGet);
        building["duration"] = Number(inputs[0][propertyToGet]) * stringToDuration(inputs[1][propertyToGet]);
        building["delegateDuration"] = stringToDuration(inputs[1][propertyToGet]);
    } else if(ty == "roundRobin") {
        building["motionType"] = "roundRobin";
        //building["fancyMotionTitle"] = "Round Robin";

        building["requiresDelegateList"] = false;
        building["timerType"] = "perDelegate";

        var inputs = parentEl.getElementsByTagName(elementNameToGet);
        building["duration"] = getListOfVotingCountries().length * stringToDuration(inputs[1][propertyToGet]);
        building["delegateDuration"] = stringToDuration(inputs[1][propertyToGet]);
        building["motionTopic"] = inputs[0][propertyToGet];
    }
    return building;
}

function passMotion(parentEl) {
    parsePassedMotionJSON(constructJSON(parentEl));
}

function parsePassedMotionJSON(details) {
    currentMotion = details;

    if(details["requiresDelegateList"]) {
        $("#passedMotionCountryChooser").css("display", "block");
        $("#chosenCountriesContainer").css("display", "flex");
    } else {
        $("#passedMotionCountryChooser").css("display", "none");
        $("#chosenCountriesContainer").css("display", "none");
    }
    $("#passedMotionName").text(details["fancyMotionTitle"]);

    $("#exitCurrentMotion").css("display", "block");
    $("#newmotions").css("display", "none");

    $("#passedMotionTopic").text(details["motionTopic"]);

    $("#modPlacementP").css("display", "none");

    if(details["timerType"] == "one") {
        document.getElementById("oneLargeTimerContainer").style.display = "block";
        largeTimerCurrentTime = details["duration"];
        largeTimerOriginalDuration = details["duration"];

        $("#yieldTimeButton").css("display", "none");
        $("#previousSpeakerButton").css("display", "none");
        $("#numberOfAddedCountriesLabel").css("display", "none");
    } else if(details["timerType"] == "perDelegate") {
        document.getElementById("oneLargeTimerContainer").style.display = "block";
        largeTimerCurrentTime = details["delegateDuration"];
        largeTimerOriginalDuration = details["delegateDuration"];
        largeTimerNumDelegates = Math.floor(details["duration"] / details["delegateDuration"] + 0.03);

        perDelegateCurrentPosition = 0;
        
        $("#modPlacementP").css("display", "block");
        $("#modDelegateIndexSpan").text("1")
        $("#modDelegateTotal").text(largeTimerNumDelegates.toString());
        $("#maxNumberOfAddedCountriesSpan").text(largeTimerNumDelegates);

        $("#yieldTimeButton").css("display", "inline");
        $("#previousSpeakerButton").css("display", "inline");

        canSortChosenCountries = true;
    } else if(details["timerType"] == "none") {
        $("#oneLargeTimerContainer").css("display", "none");
    }

    $("#chosenCountriesForTimer").sortable({
        animation : 150,
        change    : resendMirror
    });

    if(details["requiresDelegateList"]) {
        $("#chosenCountriesForTimer").css("display", "");

        $("#chosenCountriesForTimer > *").remove();
        getListOfVotingCountries().forEach(function(val) {
            $(`<button class="countryListOne outlineddiv">${val}</button>`).css("display", "block").css("width", "100%").attr("id", "modCaucusCountryChooser" + sanitizeForID(val)).on("click", modCountryChooserClickEventFunctionResponder).appendTo($("#passedMotionCountryChooser"));
        });
    } else {
        $("#chosenCountriesForTimer").css("display", "none");
    }

    $("#motiondisplays").children().toArray().forEach((el) => {
        killMotionDisplayParent(el);
    });

    $("#leftbottomarea").animate({
        opacity : 0
    }, 150, function(_e) {
        $("#leftbottomarea").css("display", "none");
        $("#leftbottomarea").css("opacity", "1");

        $("#rightbottomarea").css("display", "");
        $("#rightbottomarea").css("opacity", "0");

        $("#rightbottomarea").animate({
            opacity : 1
        }, 150);

        resendMirror();
    });

    if(details["motionType"] == "presentPapers" && ws != undefined) {
        $("#jccPassPaperContainer").css("display", "block");
    } else {
        $("#jccPassPaperContainer").css("display", "none");
    }

    refreshTimer();
    $(":focus").blur();
    isTimerHalted = false;
}

const introducePapersJSONConfig = {
    "motionType":           "presentPapers",
    //"fancyMotionTitle":     "Introduce Papers",
    "requiresDelegateList":  false,
    "timerType":            "none",
    "motionTopic":          ""
};

function doYourThing() {
    var t = document.getElementById("delegateListSearch").value.toLowerCase();
    getDelegatePresenseNodes().forEach((e) => {
        if(!$(e).hasClass("countryListOne")) return;
        if(typeof e.style != "undefined") {
            if(e.textContent.toLowerCase().includes(t)) {
                e.style.display = "";
            } else {
                e.style.display = "none";
            }
        }
    });
}

function refreshDelegateListSearch(_e_ = null, delay = 0.1) {
    if(delay < 0.001) {
        doYourThing();
        return;
    }
    setTimeout(() => {
        doYourThing();
    }, delay);
}

document.getElementById("delegateListSearch").oninput = refreshDelegateListSearch;

document.onkeydown = function(event) {
    if(isMirroring) return;
    if(document.getElementById("delegateListSearch") == document.activeElement) refreshDelegateListSearch();
    else if(!isPopupShown && (document.activeElement == document.body)) {
        if(event.key == "m") document.getElementById("newMod").click();
        if(event.key == "e") document.getElementById("editdelegatelistbutton").click();
        if(event.key == "c" && event.ctrlKey) {
            $("body").css("background-image", "url(https://mun.alex-seltzer.com/me.png)");
            return false;
        }
        if(event.key == "Escape") $("#alertContainer").css("display", "none");
    } else if(isPopupShown) {
        if(event.key == "Enter") {
            $("#exitPopup").trigger("click");
            $("#exitPopup").blur();
        }
    }
    if(document.activeElement.nodeName != "INPUT") {
        if(event.key == "Space") toggleTimer();
    }
    if(event.key == "Escape") {
        if(!isInQuickStart) if(document.getElementById("quitPopup").style.display == "none") hidePopup();
        else quitPopup();
    }
};

function changeClickedEventResponder(_event) {
    if(this.getAttribute("data-isclicked") == "false") {
        this.style.backgroundColor = "powderBlue";
        this.setAttribute("data-isclicked", "true");
    } else {
        this.style.backgroundColor = "";
        this.setAttribute("data-isclicked", "false");
    }
}

function createAlert(message, otherOptionFunction=null) {
    $("#alertContainer").css("display", "flex");
    $("#alertContainer").css("opacity", 0);
    $("#alertContainer").animate({
        opacity: 1
    }, 150);
    $("#alertText").text(message);

    if(otherOptionFunction == null) {
        $("#alertOtherOption").css("display", "none");
    } else {
        $("#alertOtherOption").css("display", "block");
        $("#alertOtherOption").off("click");
        $("#alertOtherOption").on("click", otherOptionFunction);
    }
}

function canStartTimer() {
    if(isTimerHalted) return false;
    if(currentMotion["timerType"] == "perDelegate" && currentMotion["requiresDelegateList"]) {
        if($("#chosenCountriesForTimer").children().length != largeTimerNumDelegates) {
            createAlert("Add enough delegates to the queue to start!");
            return false;
        }
    }
    return true;
}

function startTimer() {
    if(isLargeTimerGoing || !canStartTimer()) return;
    isLargeTimerGoing = true;
    $("#toggleMotionButton").text("Pause");

    refreshModCurrentCountryNumberBackground();
}

function toggleTimer() {
    if(isLargeTimerGoing) stopTimer()
    else startTimer();
}

function stopTimer() {
    if(!isLargeTimerGoing) return;
    isLargeTimerGoing = false;
    $("#toggleMotionButton").text("Start");
}

function timeToString(time) {
    return Math.floor(time / 60) + ":" + ((time % 60 < 10) ? "0" : "") + (time % 60);
}

function moveToNextDelegate() {
    stopTimer();

    if(currentMotion["timerType"] == "perDelegate") {
        if(++perDelegateCurrentPosition < largeTimerNumDelegates) {
            refreshTimer();
            largeTimerCurrentTime = largeTimerOriginalDuration;
        } else {
            largeTimerCurrentTime = 0;
            isTimerHalted = true;
            refreshTimer();
        }
    }

    refreshTimer(false);
    resendMirror();
}

function refreshTimer(e=true) {
    if(e) {
        if(isLargeTimerGoing && document.getElementById("oneLargeTimerContainer").style.display != "none" && document.getElementById("rightbottomarea").style.display != "none") {
            largeTimerCurrentTime--;
            if(largeTimerCurrentTime <= 0) {
                largeTimerCurrentTime = 0;
    
                moveToNextDelegate();
            }
            resendMirror();
        }
    }
    document.getElementById("oneLargeTimer").textContent = timeToString(largeTimerCurrentTime);

    $("#chosenCountriesForTimer").children().css("background-color", "white");
    if(!canSortChosenCountries) $($("#chosenCountriesForTimer").children()[perDelegateCurrentPosition]).css("background-color", "powderblue");

    $("#modDelegateIndexSpan").text(perDelegateCurrentPosition+1);
}

function endCurrentMotion() {
    stopTimer();

    $("#rightbottomarea").animate({
        opacity: 0
    }, 150, function(_e) {
        $("#rightbottomarea").css("display", "none");
        $("#rightbottomarea").css("opacity", "1");

        $("#leftbottomarea").css("opacity", "0");
        $("#leftbottomarea").css("display", "");
        $("#leftbottomarea").animate({
            opacity: 1
        }, 150, function(_e) {
            resendMirror();
        });
    });

    $("#exitCurrentMotion").css("display", "none");
    $("#newmotions").css("display", "block");

    currentMotion = null;

    document.getElementById("motiondisplays").childNodes.forEach((el) => {
        el.remove();
    });

    $("#passedMotionCountryChooser > *").remove();

    resendMirror();
}

function createDelegateCountryNode(name, clicked=false) {
    var outer = $("<div>");
    outer.addClass("countryListOne");

    var cb = $("<div>");
    cb.attr("data-isclicked", "false");
    cb.addClass("countryListInner");
    cb.text(name);
    cb.css("margin", "0");
    cb.on("click", changeClickedEventResponder);

    outer.append(cb);
    //outer.append($("<br>"));
    outer.append( $("#dividerLinePrefab").clone(true).attr("id", "").css("display", "block").css("margin", "5px 0 5px 25%") );

    if(clicked) {
        cb.click();
    }

    return outer;
}

function setCurrentCountryList(newList) {
    getDelegatePresenseNodes().forEach((el) => {
        $(el).remove();
    });
    $("#customDelegateList > div").remove();

    $("#normalDelegateList").append( $("#dividerLinePrefab").clone(true).attr("id", "").css("display", "block").css("margin", "10px 0 10px 25%") );
    $("#customDelegateList").append( $("#dividerLinePrefab").clone(true).attr("id", "").css("display", "block").css("margin", "10px 0 10px 25%") );

    getListOfCountries().forEach(function(v) {
        var tempNode = createDelegateCountryNode(v, newList.includes(v));

        if(basicListOfCountries.includes(v)) {
            $("#normalDelegateList").append(tempNode);
        } else {
            $("#customDelegateList").append(tempNode);
        }
    });
}

function setCustomDelegates(newCustomDelegates) {
    if(newCustomDelegates == undefined) newCustomDelegates = [];
    customDelegates = newCustomDelegates;
}

function refreshModCountryList() {
    $("#numberOfAddedCountriesSpan").text($("#chosenCountriesForTimer").children().length);
}

function refreshModCurrentCountryNumberBackground() {
    if(currentMotion["timerType"] == "perDelegate") {
        $("#chosenCountriesForTimer").children().css("background-color", "white");
        $($("#chosenCountriesForTimer").children()[perDelegateCurrentPosition]).css("background-color", "powderblue");

        $("#chosenCountriesForTimer").sortable("destroy");
        canSortChosenCountries = false;

        $("#passedMotionCountryChooser").css("display", "none");
    }
}

function modCountryChooserClickEventFunctionResponder() {
    if($("#chosenCountriesForTimer").children().length >= largeTimerNumDelegates) {
        createAlert("Queue is already filled");
        return;
    }
    
    $(`<button class="outlineddiv marginizechildren countryListOne"></button>`).css("padding", "15px").css("display", "block").css("width", "98%").on("click", function() {
        if(canSortChosenCountries) {
            $("#modCaucusCountryChooser" + sanitizeForID(this.textContent)).css("display", "");

            this.remove();

            refreshModCountryList();
            resendMirror();
        }
    }).append(`<p>${this.textContent}</p>`).appendTo($("#chosenCountriesForTimer"));

    $(this).css("display", "none");

    refreshModCountryList();
    resendMirror();
}

function motionTypeToImportance(el) {
    var n = el.getAttribute("data-motiontype");
    if(n == "presentPapers") return 100;
    if(n == "setAgenda")     return 70;
    if(n == "speakersList")  return 50 + Number( el.getElementsByTagName("input")[0].value ) / 1000;
    if(n == "unmod")         return 40 + stringToDuration( el.getElementsByTagName("input")[1].value ) / 1000;
    if(n == "roundRobin")    return 20 + stringToDuration( el.getElementsByTagName("input")[1].value ) / 1000;
    if(n == "mod")           return 0 + stringToDuration( el.getElementsByTagName("input")[1].value ) / 1000;
    return -100000; // :)
}

function showQuickStart() {
    showPopup();
    $("#quickStartPopup").css("display", "block");
    $("#quickStartPopup").css("height", "60%");
    $("#quitPopup").text("No thanks");
    $("#exitPopup").css("display", "none");
}

window.addEventListener("beforeunload", function (e) {
    e.preventDefault();
    e.returnValue = "Your current website state will not be automatically saved.";
    return "Your current website state will not be automatically saved.";
});
window.addEventListener("onbeforeunload", function (e) {
    e.preventDefault();
    e.returnValue = "Your current website state will not be automatically saved.";
    return "Your current website state will not be automatically saved.";
});

var isMirroring = false;

window.onload = function(_event) {
    if(window.location.href.includes("mobile")) { // Do mobile setup things
        $("head").append($("<link>").attr("rel", "stylesheet").attr("href", "/mobile-style.css"));

        $("#quickStartPopup").removeClass("largePopup");

        createAlert("This website is NOT meant to be used on a mobile device! It is meant to be on a large screen up at the front of the conference. But you do you, I guess.")
    }

    if(window.location.href.includes("mirror")) { // Do mirror setup things
        isMirroring = true;

        $("#newmotions").remove();
        $("#exitCurrentMotion").remove();
        $("#cloudStuffInner").remove();
        $("#firstMotionPrompt").remove();
        $("#exitButtons").remove();
        $("#editdelegatelistbutton").remove();
        $("#takeAttendanceButton").remove();
        $("#timerControlsContainer").remove();
        $("#impromptuTimerControls").remove();
        $("#jccPassPaperContainer").remove();

        $("#floatBottomRight").css("display", "none");

        $("#impromptuTimerLabel").replaceWith($("<p>").prop("id", "impromptuTimerLabel").text("5:00"))

        $("#committeeName").remove();
        $("#committeeNameContainer").append(
            $("<h1>").prop("id", "committeeName").css("background-color", "rgb(0, 0, 0, 0)")
        );

        $("#startMirroringButton").on("click", function(_e) {
            var d = {
                name     : $("#mirroringName").val(),
                password : $("#mirroringPassword").val()
            };

            $("#mirroringName").prop("disabled", true);
            $("#mirroringPassword").prop("disabled", true);
            $("#startMirroringButton").prop("disabled", true);

            $.ajax({
                type    : "POST",
                url     : "/jccLogin",
                contentType: 'application/json',
                success : function(returned) {
                    console.log(returned);
                    jccData = returned;
                    setupMirroring(returned);

                    $("#mirrorFirstStep").remove();
                },
                error   : function(returned) {
                    console.error(JSON.parse(returned.responseText));
                    createAlert(JSON.parse(returned.responseText).message);

                    $("#mirroringName").prop("disabled", false);
                    $("#mirroringPassword").prop("disabled", false);
                    $("#startMirroringButton").prop("disabled", false);
                },
                data    : JSON.stringify(d)
            });
        });
    }

    wsUrl = window.location.toString().includes("localhost") ? "ws://mun.localhost:3000/" : "wss://" + window.location.host + "/";

    $("#committeeName").val("");
    $("#committeeName").text("[No name]");
    $("#newDelegateInput").val("");

    addAttendanceNodes();

    document.getElementById("rightbottomarea").style.display = "none";

    /*$("#motiondisplays").sortable({
        animation: 100
    });**/

    setInterval(refreshTimer, 1000);

    $("#bottomarea").css("display", "block");

    $("#UNLogo").on("dragstart", function(_e) {
        return false;
    });

    if(!isMirroring) {
        $("#restartMotionTimerButton").on("click", function(_e) {
            if(!isTimerHalted) {
                stopTimer();
                if(currentMotion["timerType"] == "one") {
                    largeTimerCurrentTime = currentMotion["duration"];
                } else if(currentMotion["timerType"] == "perDelegate") {
                    largeTimerCurrentTime = currentMotion["delegateDuration"];
                }
                refreshTimer();   
            }
        });
    
        $("#previousSpeakerButton").on("click", function(_e) {
            if(perDelegateCurrentPosition > 0) {
                stopTimer();
                --perDelegateCurrentPosition;
                largeTimerCurrentTime = largeTimerOriginalDuration;
                refreshModCurrentCountryNumberBackground();
                refreshTimer();
            }
        });
    
        $("#yieldTimeButton").on("click", function(_e) {
            if(!isTimerHalted && !canSortChosenCountries && perDelegateCurrentPosition <= largeTimerNumDelegates-1) {
                moveToNextDelegate();
            }
        });
    
        $("#saveToCloudButton").on("click", function(_e) {
            if(!window.navigator.onLine) {
                createAlert("You must be connected to the internet");
                return;
            }
            showPopup();
            $("#saveToTheCloudPopup").css("display", "block");
            $("#exitPopup").css("display", "none");
            $("#saveToCloudName").val("");
        });
    
        $("#saveToCloudSubmit").on("click", function(_e) {
            if($("#saveToCloudName").val().length <= 0) {
                createAlert("Name cannot be empty");
                return;
            }
            var d = {
                id   : $("#saveToCloudName").val(),
                data : getStateJSON()
            };
            $.ajax({
                type    : "POST",
                url     : "/savesavedata",
                contentType: 'application/json',
                success : function(returned) {
                    createAlert(JSON.parse(returned).message);
                },
                error   : function(returned) {
                    createAlert(JSON.parse(returned));
                    console.log(returned);
                },
                data    : JSON.stringify(d)
            });
            quitPopup();
        });
    
        $("#loadFromCloudButton").on("click", function(_e) {
            if(!window.navigator.onLine) {
                createAlert("You must be connected to the internet");
                return;
            }
            showPopup();
            $("#loadFromTheCloudPopup").css("display", "block");
            $("#exitPopup").css("display", "none");
            $("#loadFromCloudName").val("");
        });
    
        $("#loadFromCloudSubmit").on("click", function(_e) {
            if($("#loadFromCloudName").val().length <= 0) {
                createAlert("Name cannot be empty");
                return;
            }
            var d = {
                id   : $("#loadFromCloudName").val()
            };
            console.log(d);
            $.ajax({
                type    : "POST",
                url     : "/getsavedata",
                contentType: 'application/json',
                success : function(returned) {
                    console.log(returned);
                    implementStateJSON(JSON.parse(returned));
                },
                error   : function(returned) {
                    createAlert(returned);
                    console.log(returned);
                },
                data    : JSON.stringify(d)
            });
            quitPopup();
        });
    
        $("#logoContainer").on("click", function(_e) {
            if(isPopupShown) return;
            showPopup();
            $("#legalStuffEwww").css("display", "block").css("height", "60%");
            $("#quitPopup").text("Close");
            $("#exitPopup").css("display", "none");
        });
    
        $("#newDelegateSubmit").on("click", function(_e) {
            if($("#newDelegateInput").val() == "") return;
    
            customDelegates.push($("#newDelegateInput").val());
            
            $("#customDelegateList").append(createDelegateCountryNode($("#newDelegateInput").val()));
    
            $("#newDelegateInput").val("");
    
            hasMadeNewDelegate = true;
    
            refreshDelegateListSearch(0);
        });

        $("#impromptuTimerStartStop").on("click", function(_e) {
            if(isImpromptuTimerGoing) {
                isImpromptuTimerGoing = false;
                $("#impromptuTimerStartStop").text("Start");
            } else {
                isImpromptuTimerGoing = true;
                $("#impromptuTimerStartStop").text("Pause");
            }
        });
        $("#impromptuTimerLabel").on("focus", function(_e) {
            isImpromptuTimerGoing = false;
            $("#impromptuTimerStartStop").text("Start");
        });
        $("#impromptuTimerLabel").on("blur", function(_e) {
            if(isTimeInvalid($("#impromptuTimerLabel").val())) {
                $("#impromptuTimerLabel").val("5:00");
            }
            impromptuTime = stringToDuration($("#impromptuTimerLabel").val());
            originalImpromptuTime = impromptuTime;
        });
        $("#impromptuTimerReset").on("click", function(_e) {
            impromptuTime = originalImpromptuTime;
            isImpromptuTimerGoing = false;
            $("#impromptuTimerLabel").val(durationToString(impromptuTime));

            resendMirror();
        });
    
        $("#allPresentButton").on("mousedown", function(_e) {
            Array(...document.getElementById('attendanceListOfCountries').children).forEach((el) => {
                if($(el).css("display") != "none" && typeof el.childNodes[5] != 'undefined') {
                    el.childNodes[5].click();
                }
            });
        });
    
        $("#startJCC").on("click", function(_e) {
            showPopup();
            $("#joinJccPopup").css("display", "block");
        });
        $("#jccInfo").on("click", function(_e) {
            showPopup();
            $("#jccInfoPopup").css("display", "block");
        });
        $("#newJCC").on("click", function(_e) {
            if($("#newJccName").val() == "") {
                createAlert("JCC name cannot be empty");
                return;
            }
            var d = {
                name     : $("#newJccName").val(),
                password : $("#newJccPassword").val()
            };
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
        });
        $("#joinJCC").on("click", function(_e) {
            if($("#newJccName").val() == "") {
                createAlert("JCC name cannot be empty");
                return;
            }
            var d = {
                name     : $("#newJccName").val(),
                password : $("#newJccPassword").val()
            };
            hidePopup();
            $("#startJCC").css("display", "none");
            $.ajax({
                type    : "POST",
                url     : "/jccLogin",
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
        });
        $("#jccSendMessageButton").on("click", function(_e) {
            if(ws == undefined) return;
            var d = {
                name : jccData.name,
                salt : jccData.salt,
                type : "message",
                messageBody : $("#jccSendMessageInput").val(),
                sender     : $("#committeeName").val()
            };
            ws.send(JSON.stringify(d));
            $("#jccSendMessageInput").val("");
        });
        $("#passedPaperButton").on("click", function(_e) {
            if(ws == undefined) return;
            var d = {
                name : jccData.name,
                salt : jccData.salt,
                type : "paperPassed",
                messageBody : $("#passedPaperNameInput").val(),
                sender     : $("#committeeName").val()
            };
            ws.send(JSON.stringify(d));
            $("#passedPaperNameInput").val("");
        });
    
        $("#newMod").on("click", function(_event) {
            if(numDelegatesInCommittee == 0) {
                createAlert('You have not chosen any delegates to be in committee.', (_e) => {
                    $("#editdelegatelistbutton").click()
                });
                return;
            }
            if(getListOfVotingCountries().length <= 0) {
                createAlert('You have not taken attendance', (_e) => {
                    $("#takeAttendanceButton").click()
                });
                return;
            }
            showPopup();
            document.getElementById("newModPopup").style.display = "block";
            document.getElementById("newModTopic").value = "";
            document.getElementById("newModPopupDuration").value = "5:00";
            document.getElementById("newModPopupDelegateDuration").value = "1:00";
        
            document.getElementById("newModTopic").focus()
        });
        
        document.getElementById("newSpeakersList").onclick = function(_event) {
            if(numDelegatesInCommittee == 0) {
                createAlert('You have not chosen any delegates to be in committee. Click "Edit List" to do so.', (_e) => {
                    $("#editdelegatelistbutton").click()
                });
                return;
            }
            if(getListOfVotingCountries().length <= 0) {
                createAlert('You have not taken attendance', (_e) => {
                    $("#takeAttendanceButton").click()
                });
                return;
            }
            showPopup();
            document.getElementById("speakersListPopup").style.display = "block";
            document.getElementById("speakersListNumDelegates").value = "10";
            document.getElementById("speakersListPopupDelegateDuration").value = "1:00";
        
            document.getElementById("speakersListNumDelegates").focus()
        }
        
        document.getElementById("newUnmod").onclick = function(_event) {
            showPopup();
            document.getElementById("newUnmodPopup").style.display = "block";
            document.getElementById("newUnmodTopic").value = "";
            document.getElementById("newUnmodPopupDuration").value = "5:00";
        
            document.getElementById("newUnmodTopic").focus()
        }
    
        $("#newIntroduce").on("click", function(_e) {
            // parsePassedMotionJSON(introducePapersJSONConfig);
            var toAdd = $("#presentPapersMotionPrefab").clone(true);
        
            appendMotion(toAdd);
        });
        
        document.getElementById("newRoundRobin").onclick = function(_event) {
            if(numDelegatesInCommittee == 0) {
                createAlert('You have not chosen any delegates to be in committee. Click "Edit List" to do so.', (_e) => {
                    $("#editdelegatelistbutton").click()
                });
                return;
            }
            if(getListOfVotingCountries().length <= 0) {
                createAlert('You have not taken attendance', (_e) => {
                    $("#takeAttendanceButton").click()
                });
                return;
            }
            showPopup();
            document.getElementById("roundRobinPopup").style.display = "block";
            document.getElementById("roundRobinTopic").value = "";
            $("#roundRobinDelegateDuration").val("0:15")
        
            document.getElementById("roundRobinTopic").focus()
        }
        
        document.getElementById("editdelegatelistbutton").onclick = function(_event) {
            showPopup();
            document.getElementById("editDelegateList").style.display = "flex";
            $("#editDelegateList").css("height", "60%");
            document.getElementById("delegateListSearch").value = "";
            refreshDelegateListSearch();
            document.getElementById("quitPopup").style.display = "none";
        };
        
        document.getElementById("exitPopup").onclick = function(_event) {
            if(isPopupShown) {
                hidePopup();
            }
        };
        
        document.getElementById("takeAttendanceButton").onclick = function(_e) {
            if(numDelegatesInCommittee == 0) {
                createAlert("Add some delegates to the committee before you take attendance!", (_e) => {
                    $("#editdelegatelistbutton").click()
                });
                return;
            }
            if(!isPopupShown) {
                showPopup();
                document.getElementById("attendanceList").style.display = "block";
                $("#attendanceList").css("height", "60%");
                document.getElementById("quitPopup").style.display = "none";
            }
        };
    
        setInterval(function(_e) {
            if(document.activeElement == document.getElementById("impromptuTimerLabel")) return;
            if(isImpromptuTimerGoing) {
                impromptuTime--;
                if(impromptuTime <= 0) {
                    impromptuTime = 0;
                    isImpromptuTimerGoing = false;
                    $("#impromptuTimerStartStop").text("Start");
                }
                $("#impromptuTimerLabel").val(durationToString(impromptuTime));
                $("#impromptuTimerLabel").text(durationToString(impromptuTime));

                resendMirror();
            }
        }, 1000);

        $("#committeeName").on("change", resendMirror);
    }

    $("#impromptuTimerButton").on("click", function(_e) {
        if(isPopupShown) return;
        showPopup();
        $("#impromptuTimer").css("display", "block").css("height", "60%");
        $("#exitPopup").css("display", "none");
        $("#quitPopup").text("Close");

        resendMirror();
    });

    $("#commenceRollCall").on("click", function(_e) {
        if(getListOfVotingCountries().length <= 0) {
            createAlert("Take attendance before taking a roll call vote!", function() {
                $("#takeAttendanceButton").click();
            });
            return;
        }
        $("#rollCallButtonContainer > *").prop("disabled", false);
        
        numPossibleVoters = getListOfVotingCountries().length;
        if(numDelegatesInCommittee == 0) {
            createAlert('You have not chosen any delegates to be in committee. Click "Edit List" then take attendance to take a roll call vote.',
            (e) => {
                $("#editdelegatelistbutton").click()
            });
            return;
        } else if(numPossibleVoters == 0) {
            createAlert('You have not taken attendance. Click "Attendance" before you take a roll call vote.',
            (e) => {
                $("#takeAttendanceButton").click()
            });
            return;
        }

        $("#rollCallPastChoices > *").remove();

        var ttt = 0;
        getListOfVotingCountries().forEach(function(el) {
            $("#rollCallPastChoices").append(
                $("<div>").attr("data-num", ttt++).attr("data-bg-color", "#ffffff").append($(`<p class="expandAllTheWay">${el}</p>`)).append($(`<p class="expandAllTheWay entireLineHeight">No Vote</p>`)).on("click", function(_e) {
                    rollCallCurrentVoter = $(this).attr("data-num");
                    goToNextRollCallVote(false);
                })
            )
        });

        showPopup();
        $("#rollCallVotePopup").css("display", "block");
        $("#quitPopup").text("Close");
        $("#exitPopup").css("display", "none");

        rollCallCurrentVoter = 0;
        rollCallCurrentVotes = new Array(numPossibleVoters).fill("No Vote");
        rollCallNumNays      = 0;
        rollCallNumYeas      = 0;
        rollCallNumAbstains  = 0;
        hasRollCallFinished  = false;

        $("#rollCallNumVotesNeededToWin").text(Math.ceil((getListOfVotingCountries().length+1)/2))

        $($(`#rollCallPastChoices`).children().toArray()[rollCallCurrentVoter]).css("background-color", "powderblue");
        
        $("#rollCallCountryName").text(getListOfVotingCountries()[rollCallCurrentVoter]);
        $("#rollCallVoterAttendance").text(
            getDictOfVotingCountries()[getListOfVotingCountries()[rollCallCurrentVoter]] == "Pr" ? "Present" : "Present and Voting"
        );
        
        if(getDictOfVotingCountries()[getListOfVotingCountries()[rollCallCurrentVoter]] == "Pr") {
            $("#rollCallAbstainButton").prop("disabled", false);
        } else {
            $("#rollCallAbstainButton").prop("disabled", true);
        }

        $("#yeaRollCallSegment").css("width", ((rollCallNumYeas/numPossibleVoters)*100) + "%");
        $("#abstainRollCallSegment").css("left", ((rollCallNumYeas/numPossibleVoters)*100) + "%");
        $("#abstainRollCallSegment").css("width", (((numPossibleVoters-rollCallNumYeas-rollCallNumNays)/numPossibleVoters)*100) + "%");
        $("#nayRollCallSegment").css("width", ((rollCallNumNays/numPossibleVoters)*100) + "%");

        $("#yeaRollCallSegment").text(rollCallNumYeas + (rollCallNumYeas != 1 ? " yeas" : " yea"));
        $("#abstainRollCallSegment").text(rollCallNumAbstains + (rollCallNumAbstains != 1 ? " abstains" : " abstain"));
        $("#nayRollCallSegment").text(rollCallNumNays + (rollCallNumNays != 1 ? " nays" : " nay"));

        //$(`#rollCallPastChoices`).children().toArray()[0].scrollIntoView();
        lastSent = -1000;
        resendMirror();
    });

    $("#impromptuTimerLabel").val("5:00");
    $("#quickStartAttendance").prop("disabled", true);

    setCurrentCountryList([]);
    recalcDelegates();

    if(!isMirroring) {
        showQuickStart();
    } else {
        showPopup();
        $("#mirrorSetupPopup").css("display", "block");
    }
}

function getTime() {
    let dat = new Date()
    return dat.getMinutes()*60 + dat.getSeconds() + dat.getMilliseconds()/1000
}

var lastSent = -1000;

function resendMirror() {
    //if(getTime - lastSent < 1.5) return;
    if(!jccData || ws.readyState != 1 || isMirroring) return;

    var d = {
        name  : jccData.name,
        type  : "sendMirror",
        salt  : jccData.salt,
        state : getStateJSON()
    }
    if(ws && ws.readyState == 1 && mySalt) {
        ws.send(JSON.stringify(d));
    }
}

var seenStates = {  };

var hasChoosenMirrorable = false;
var chosenMirrorableSalt = "";

function setupMirroring(data) {
    jccData = data;

    ws = new WebSocket(wsUrl, "echo-protocol");

    ws.addEventListener("open", function(_e) {
        console.log("Connected to WebSocket");
        ws.send(JSON.stringify({
            name       : jccData.name,
            type       : "setup",
            salt       : jccData.salt,
            clientType : "mirror"
        }));
    });
    ws.addEventListener("message", function(m) {
        if(m.data == "Connected") {
            ws.send(JSON.stringify({
                name       : jccData.name,
                salt       : jccData.salt,
                type       : "requestMirrors"
            }));
            console.log("Requesting mirrors...");

            $("#mirrorSecondStep").css("display", "block");
        } else if(!hasChoosenMirrorable) {
            var d = JSON.parse(m.data).state;
            if(!seenStates[d.mySalt]) {
                $("#listOfMirrorables").append(
                    $("<button>").css("padding", "10px").css("margin", "10px").css("display", "inline-block").text(d.committeeName).on("click", function(_e) {
                        hasChoosenMirrorable = true;
                        chosenMirrorableSalt = d.mySalt;
                        hidePopup();
                        implementAttendanceList(d);

                        ws.send(JSON.stringify({
                            name       : jccData.name,
                            salt       : jccData.salt,
                            type       : "requestMirrors"
                        }));
                    })
                );
                $("#listOfMirrorables").append($("<br>"));
            }
            seenStates[d.mySalt] = d;
        } else {
            if(JSON.parse(m.data).state.mySalt == chosenMirrorableSalt) {
                implementStateJSON(JSON.parse(m.data).state);
            }
        }
    });
    ws.addEventListener("close", function(_e) {
        createAlert("Disconnected from server, trying to reconnect...");
        setupMirroring();
    });
}

var mySalt = "";

function setupJccData(data) {
    jccData = data;
    $("#jccNameSpan").text(data.name);

    ws = new WebSocket(wsUrl, "echo-protocol");
    
    ws.addEventListener("open", function(_e) {
        console.log("Connected to WebSocket");
        ws.send(JSON.stringify({
            name       : data.name,
            type       : "setup",
            salt       : data.salt,
            clientType : "bigScreen"
        }));
        $("#jccInfo").css("display", "inline-block");
    });
    ws.addEventListener("message", function(m) {
        console.log(m.data);
        //createAlert("Message: " + JSON.parse(m.data).messageBody);
        if(JSON.parse(m.data).type == "returnSalt" && JSON.parse(m.data).salt) {
            mySalt = JSON.parse(m.data).salt;
            resendMirror();
        } else if(JSON.parse(m.data).type == "requestMirrors") {
            resendMirror();
        }
    });
    ws.addEventListener("close", function(_e) {
        createAlert("Disconnected from server, trying to reconnect...");
        $("#newJCC").click();
    });
}

var ws;
var jccData;

var isImpromptuTimerGoing = false;
var impromptuTime         = 300;
var originalImpromptuTime = 300;

var hasRollCallFinished = false;

function goToNextRollCallVote(proceeds=true) { // It's best to not look at this function for too long
                                               // If proceeds is false, it just updates the view
    if(hasRollCallFinished) {
        return;
    }
    $(`#rollCallPastChoices`).children().toArray().forEach((el) => {
        $(el).css("background-color", $(el).attr("data-bg-color"));
    });
    if(proceeds) rollCallCurrentVoter++;
    if(rollCallCurrentVoter == numPossibleVoters) {
        rollCallCurrentVoter--;
        //hasRollCallFinished = true;
    }
    $($(`#rollCallPastChoices`).children().toArray()[rollCallCurrentVoter]).css("background-color", "powderblue");

    //if(proceeds) $(`#rollCallPastChoices`).children().toArray()[rollCallCurrentVoter].scrollIntoView({behavior: "smooth"});

    $("#rollCallCountryName").text(getListOfVotingCountries()[rollCallCurrentVoter]);
    $("#rollCallVoterAttendance").text(
        getDictOfVotingCountries()[getListOfVotingCountries()[rollCallCurrentVoter]] == "Pr" ? "Present" : "Present and Voting"
    );

    if(getDictOfVotingCountries()[getListOfVotingCountries()[rollCallCurrentVoter]] == "Pr") {
        $("#rollCallAbstainButton").prop("disabled", false);
    } else {
        $("#rollCallAbstainButton").prop("disabled", true);
    }

    $("#yeaRollCallSegment").css("width", ((rollCallNumYeas/numPossibleVoters)*100) + "%");
    $("#abstainRollCallSegment").css("left", ((rollCallNumYeas/numPossibleVoters)*100) + "%");
    $("#abstainRollCallSegment").css("width", (((numPossibleVoters-rollCallNumYeas-rollCallNumNays)/numPossibleVoters)*100) + "%");
    $("#nayRollCallSegment").css("width", ((rollCallNumNays/numPossibleVoters)*100) + "%");

    $("#yeaRollCallSegment").text(rollCallNumYeas + (rollCallNumYeas != 1 ? " yeas" : " yea"));
    $("#abstainRollCallSegment").text(rollCallNumAbstains + (rollCallNumAbstains != 1 ? " abstains" : " abstain"));
    $("#nayRollCallSegment").text(rollCallNumNays + (rollCallNumNays != 1 ? " nays" : " nay"));

    if(hasRollCallFinished) {
        $("#rollCallButtonContainer > *").prop("disabled", true);

        $(`#rollCallPastChoices`).children().toArray().forEach((el) => {
            $(el).css("background-color", $(el).attr("data-bg-color"));
        });
    }
}

$("#rollCallYeaButton").on("click", function(_e) {
    if(!hasRollCallFinished) {
        if(rollCallCurrentVotes[rollCallCurrentVoter] == "Yea") rollCallNumYeas--;
        else if(rollCallCurrentVotes[rollCallCurrentVoter] == "Nay") rollCallNumNays--;
        else if(rollCallCurrentVotes[rollCallCurrentVoter] == "Abstain") rollCallNumAbstains--;

        $($(`#rollCallPastChoices`).children().toArray()[rollCallCurrentVoter]).children().toArray()[1].textContent = "Yea";
        rollCallCurrentVotes[rollCallCurrentVoter] = "Yea";
        rollCallNumYeas++;

        $($("#rollCallPastChoices").children().get(rollCallCurrentVoter)).attr("data-bg-color", "#a1fc85");
    }
    goToNextRollCallVote();
});

$("#rollCallNayButton").on("click", function(_e) {
    if(!hasRollCallFinished) {
        if(rollCallCurrentVotes[rollCallCurrentVoter] == "Yea") rollCallNumYeas--;
        else if(rollCallCurrentVotes[rollCallCurrentVoter] == "Nay") rollCallNumNays--;
        else if(rollCallCurrentVotes[rollCallCurrentVoter] == "Abstain") rollCallNumAbstains--;

        $($(`#rollCallPastChoices`).children().toArray()[rollCallCurrentVoter]).children().toArray()[1].textContent = "Nay";
        rollCallCurrentVotes[rollCallCurrentVoter] = "Nay";
        rollCallNumNays++;

        $($("#rollCallPastChoices").children().get(rollCallCurrentVoter)).attr("data-bg-color", "#f9877c");
    }
    goToNextRollCallVote();
});

$("#rollCallAbstainButton").on("click", function(_e) {
    if(!hasRollCallFinished) {
        if(rollCallCurrentVotes[rollCallCurrentVoter] == "Yea") rollCallNumYeas--;
        else if(rollCallCurrentVotes[rollCallCurrentVoter] == "Nay") rollCallNumNays--;
        else if(rollCallCurrentVotes[rollCallCurrentVoter] == "Abstain") rollCallNumAbstains--;

        rollCallNumAbstains++;
        $($(`#rollCallPastChoices`).children().toArray()[rollCallCurrentVoter]).children().toArray()[1].textContent = "Abstain";
        rollCallCurrentVotes[rollCallCurrentVoter] = "Abstain";

        $($("#rollCallPastChoices").children().get(rollCallCurrentVoter)).attr("data-bg-color", "#7a7a7a");
    }
    
    goToNextRollCallVote();
});

function firstAttendanceClick(element, _e) {
    var el = element;

    el.style.backgroundColor = "red";
    el.setAttribute("data-clicked", "true");

    el.nextElementSibling.setAttribute("data-clicked", "false");
    el.nextElementSibling.style.backgroundColor = "";

    el.nextElementSibling.nextElementSibling.setAttribute("data-clicked", "false");
    el.nextElementSibling.nextElementSibling.style.backgroundColor = "";
}
function secondAttendanceClick(element, _e) {
    var el = element;

    el.style.backgroundColor = "#00ff00";
    el.setAttribute("data-clicked", "true");

    el.previousElementSibling.setAttribute("data-clicked", "false");
    el.previousElementSibling.style.backgroundColor = "";

    el.nextElementSibling.setAttribute("data-clicked", "false");
    el.nextElementSibling.style.backgroundColor = "";
}
function thirdAttendanceClick(element, _e) {
    var el = element;

    el.style.backgroundColor = "powderBlue";
    el.setAttribute("data-clicked", "true");

    el.previousElementSibling.setAttribute("data-clicked", "false");
    el.previousElementSibling.style.backgroundColor = "";

    el.previousElementSibling.previousElementSibling.setAttribute("data-clicked", "false");
    el.previousElementSibling.previousElementSibling.style.backgroundColor = "";
}

function durationToString(n) {
    return Math.floor(n/60) + ":" + (n%60 < 10 ? "0" : "") + (n%60);
}

function getStateJSON() {
    if(isMirroring) return { };

    var toReturn = {
        mySalt        : mySalt,

        committeeName : $("#committeeName").val() || $("#committeeName").text(),

        customDelegates : customDelegates,

        attendance: {
            // Ex. "United States" : "PV"
        },

        proposedMotions: [

        ],

        isThereACurrentMotion : $("#rightbottomarea").css("display") != "none",

        isThereARollCall      : $("#rollCallVotePopup").css("display") == "block",

        isImpromptuTimerOpen  : $("#impromptuTimer").css("display") == "block",

        impromptuTime         : impromptuTime,

        currentMotion : {

        },

        rollCallDetails : {
            listOfVotes : [

            ]
        }
    };

    toReturn.attendance = getDictOfVotingCountries();

    $("#motiondisplays").children().each(function(e) {
        if(this.nodeName != "DIV") return;
        var t = {};
        t["type"] = this.getAttribute("data-motiontype");
        t["rngid"] = this.getAttribute("data-rngid");
        var inputs = this.getElementsByTagName("input");
        if(t["type"] == "mod") {
            t["topic"] = inputs[0].value;
            t["totalDuration"] = stringToDuration(inputs[1].value);
            t["delegateDuration"] = stringToDuration(inputs[2].value);
        } else if(t["type"] == "unmod") {
            t["topic"] = inputs[0].value;
            t["duration"] = stringToDuration(inputs[1].value);
        } else if(t["type"] == "roundRobin") {
            t["topic"] = inputs[0].value;
            t["delegateDuration"] = stringToDuration(inputs[1].value);
        } else if(t["type"] == "speakersList") {
            t["numberOfSpeakers"] = Number(inputs[0].value);
            t["delegateDuration"] = stringToDuration(inputs[1].value);
        } else if(t["type"] == "presentPapers") {
            // None
        }

        toReturn["proposedMotions"].push(t);
    });

    if(toReturn.isThereACurrentMotion) {
        toReturn.currentMotion = currentMotion;

        if(toReturn.currentMotion.motionType == "mod" || toReturn.currentMotion.motionType == "speakersList") {
            toReturn.currentMotion.currentTime      = largeTimerCurrentTime;
            toReturn.currentMotion.currentDelegate  = perDelegateCurrentPosition;
            toReturn.currentMotion.chosenCountries  = [];
            toReturn.currentMotion.canSortCountries = canSortChosenCountries;

            $("#chosenCountriesForTimer").children().each(function(e) {
                toReturn.currentMotion.chosenCountries.push($(this).children()[0].textContent);
            });
        } else if(toReturn.currentMotion.motionType == "unmod") {
            toReturn.currentMotion.currentTime      = largeTimerCurrentTime;
        } else if(toReturn.currentMotion.motionType == "roundRobin") {
            toReturn.currentMotion.currentTime      = largeTimerCurrentTime;
            toReturn.currentMotion.currentDelegate  = perDelegateCurrentPosition;
        }
    }

    if(toReturn.isThereARollCall) {
        toReturn.rollCallDetails.currentCountry = $("#rollCallCountryName").text();

        toReturn.rollCallDetails.yeas           = rollCallNumYeas;
        toReturn.rollCallDetails.nays           = rollCallNumNays;
        toReturn.rollCallDetails.abstains       = rollCallNumAbstains;

        toReturn.rollCallDetails.currentVoter   = rollCallCurrentVoter;

        var loc = $("#rollCallPastChoices").children();
        for(var i = 0; i < loc.length; i++) {
            var t = $($(loc.get(i)).children("p"));
            toReturn.rollCallDetails.listOfVotes.push([
                t.get(0).textContent,
                t.get(1).textContent
            ]);
        }
    }

    return toReturn;
}

var lastMotionList = [];

function getIdOfMotionJSON(m) {
    var toReturn = "";
    for(k in Object.keys(m)) {
        toReturn += Object.keys(m)[k];
        toReturn += m[Object.keys(m)[k]];
    }
    return toReturn;
}

function implementStateJSON(newState) {
    if("success" in newState && !newState.success) { // Network sent an error =(
        createAlert(`Request unsuccessful with error code ${newState.code}: ${newState.message}`);
        console.log(newState);
        return;
    }

    var newMotions = [];

    if(isMirroring && false) { // Tried to make the transition work all nice. I failed.
        var toRemove   = [];

        // Check for motions in newState but not on the screen
        for(m1i in newState.proposedMotions) { // Oops! O(n²)!
            let m1 = newState.proposedMotions[m1i];
            var m1id = getIdOfMotionJSON(m1);
            var isNewMotion = true;
            for(m2i in lastMotionList) {
                let m2 = newState.proposedMotions[m2i];
                if(m1id == getIdOfMotionJSON(m2)) {
                    isNewMotion = false;
                    break;
                }
            }
            if(isNewMotion) newMotions.push(m1);
        }

        // Check for motions on the screen but not in newState
        for(m1i in lastMotionList) { // Oops! O(n²)!
            var m1id = getIdOfMotionJSON(lastMotionList[m1i]);
            var isStillHere = false;
            for(m2 in newState.proposedMotions) {
                if(m1id == getIdOfMotionJSON(m2)) {
                    isStillHere = true;
                    break;
                }
            }
            if(!isStillHere) {
                toRemove.push(m1id);
            }
        }

        console.log(toRemove);

        lastMotionList = newState.proposedMotions;

        $("#motiondisplays").children().toArray().forEach((el) => {
            if(toRemove.includes(getIdOfMotionJSON(constructJSON(el)))) {
                el.remove();
            }
        });
    } else {
        $("#motiondisplays > *").remove();
        newMotions = newState.proposedMotions;
    }

    if(!isMirroring) {
        hidePopup();
    } else {
        if(isPopupShown) {
            if(newState.isImpromptuTimerOpen && $("#impromptuTimer").css("display") != "none") {
                
            } else if(newState.isThereARollCall && $("#rollCallVotePopup").css("display") != "none") {
                
            } else {
                hidePopup();
            }
        }
    }

    setCustomDelegates(newState.customDelegates);

    refreshAttendanceNodes();
    implementAttendanceList(newState.attendance);

    setCurrentCountryList(Object.keys(newState.attendance));
    $("#allAbsentButton").click();
    recalcDelegates();

    $("#committeeName").val(newState.committeeName);
    $("#committeeName").text(newState.committeeName);

    if(!newState.isThereACurrentMotion) {
        for(var i = 0; i < newMotions.length; i++) {
            var cm = newMotions[i];
            if(cm.type == "mod") {
                var toAdd = $("#modMotionPrefab").clone(true);
                var inputList = toAdd.find("input");
                inputList[0].value = cm.topic;
                inputList[1].value = durationToString(cm.totalDuration);
                inputList[1].textContent = durationToString(cm.totalDuration);

                inputList[2].value = durationToString(cm.delegateDuration);
                inputList[2].textContent = durationToString(cm.delegateDuration);

                appendMotion(toAdd);
            } else if(cm.type == "unmod") {
                var toAdd = $("#unmodMotionPrefab").clone(true);
                var inputList = toAdd.find("input");
                inputList[0].value = cm.topic;
                inputList[0].textContent = cm.topic;

                inputList[1].value = durationToString(cm.duration);
                inputList[1].textContent = durationToString(cm.duration);

                appendMotion(toAdd);
            } else if(cm.type == "roundRobin") {
                var toAdd = $("#roundRobinMotionPrefab").clone(true);
                var inputList = toAdd.find("input");
                inputList[0].value = cm.topic;
                inputList[0].textContent = cm.topic;

                inputList[1].value = durationToString(cm.delegateDuration);
                inputList[1].textContent = durationToString(cm.delegateDuration);

                appendMotion(toAdd);
            } else if(cm.type == "speakersList") {
                var toAdd = $("#speakersListMotionPrefab").clone(true);
                var inputList = toAdd.find("input");
                inputList[0].value = cm.numberOfSpeakers;
                inputList[0].textContent = cm.numberOfSpeakers;

                inputList[1].value = durationToString(cm.delegateDuration);
                inputList[1].textContent = durationToString(cm.delegateDuration);

                appendMotion(toAdd);
            } else if(cm.type == "presentPapers") {
                var toAdd = $("#presentPapersMotionPrefab").clone(true);
                appendMotion(toAdd);
            }
        }
    } else {
        parsePassedMotionJSON(newState.currentMotion);
        if(newState.currentMotion.motionType == "mod" || newState.currentMotion.motionType == "speakersList") {
            newState.currentMotion.chosenCountries.forEach((el) => {
                $("#modCaucusCountryChooser" + sanitizeForID(el)).click();
            });
            largeTimerCurrentTime      = newState.currentMotion.currentTime;
            perDelegateCurrentPosition = newState.currentMotion.currentDelegate;

            refreshTimer(false);
            refreshModCurrentCountryNumberBackground();
        } else if(newState.currentMotion.motionType == "unmod") {
            largeTimerCurrentTime      = newState.currentMotion.currentTime;

            refreshTimer(false);
        } else if(newState.currentMotion.motionType == "roundRobin") {
            largeTimerCurrentTime      = newState.currentMotion.currentTime;
            perDelegateCurrentPosition = newState.currentMotion.currentDelegate

            refreshTimer(false);
        }
    }

    if(newState.isImpromptuTimerOpen) {
        $("#impromptuTimerButton").click();

        $("#impromptuTimerLabel").val(durationToString(newState.impromptuTime));
        $("#impromptuTimerLabel").text(durationToString(newState.impromptuTime));
    }

    if(newState.isThereARollCall) {
        $("#commenceRollCall").click();
        $("#rollCallPastChoices > *").css("background-color", "");

        rollCallCurrentVoter = newState.rollCallDetails.currentVoter;

        rollCallNumYeas      = newState.rollCallDetails.yeas;
        rollCallNumNays      = newState.rollCallDetails.nays;
        rollCallNumAbstains  = newState.rollCallDetails.abstains;

        rollCallCurrentVoter = newState.rollCallDetails.currentVoter;

        for(var i = 0; i < newState.rollCallDetails.listOfVotes.length; i++) {
            $($("#rollCallPastChoices").children().get(i)).children().get(0).textContent = newState.rollCallDetails.listOfVotes[i][0];
            $($("#rollCallPastChoices").children().get(i)).children().get(1).textContent = newState.rollCallDetails.listOfVotes[i][1];
        }

        goToNextRollCallVote(false);
    }
}