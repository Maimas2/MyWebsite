// Licensed under GPLv3

// Mmm spaghetti and meatballs

// Libraries used:
// - ExpressJS
// - SortableJS
// - jQuery
// - body-parser
// - jQuery-sortablejs
// - vHost


var basicListOfCountries = new Array("Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei Darussalam", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Ivory Coast", "Croatia", "Cuba", "Cyprus", "Czechia", "North Korea", "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Lao People's Democratic Republic", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Republic of Korea", "Republic of Moldova", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syrian Arab Republic", "Tajikistan", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Türkiye", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United Republic of Tanzania", "United States of America", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe", "Holy See");

var testImplementJson = JSON.parse(`{
    "attendance": {
      "Bahamas": "A",
      "China": "Pr",
      "France": "Pr&V",
      "Russia": "Pr",
      "United Kingdom": "Pr&V",
      "United States of America": "Pr"
    },
    "proposedMotions": [
      {
        "type": "presentPapers"
      },
      {
        "type": "speakersList",
        "numberOfSpeakers": 10,
        "delegateDuration": 60
      },
      {
        "type": "unmod",
        "topic": "It's so joever",
        "duration": 300
      },
      {
        "type": "roundRobin",
        "topic": "What the sigma",
        "delegateDuration": 15
      },
      {
        "type": "mod",
        "topic": "Ooga booga",
        "totalDuration": 300,
        "delegateDuration": 60
      }
    ],
    "isThereACurrentMotion": false,
    "isThereARollCall": false,
    "currentMotion": {}
  }`);

var testJson2 = JSON.parse(`{
    "attendance": {
      "China": "Pr",
      "France": "Pr",
      "Russia": "Pr",
      "United Kingdom": "Pr",
      "United States of America": "Pr"
    },
    "proposedMotions": [],
    "isThereACurrentMotion": false,
    "isThereARollCall": true,
    "currentMotion": {},
    "rollCallDetails": {
      "listOfVotes": [
        [
          "China",
          "Nay"
        ],
        [
          "France",
          "Yea"
        ],
        [
          "Russia",
          "Yea"
        ],
        [
          "United Kingdom",
          "Nay"
        ],
        [
          "United States of America",
          "No Vote"
        ]
      ],
      "currentCountry": "United States of America",
      "yeas": 2,
      "nays": 2,
      "abstains": 0,
      "currentVoter": 4
    }
  }`);

var customDelegates = new Array(
    
);

function getListOfCountries() {
    return basicListOfCountries.concat(customDelegates);
}

var listOfPresentCountries = [];

var isPopupShown = false;
var numDelegatesInCommittee = 0;

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

var votingListThing = {

};
var rollCallCurrentVoter = 0;
var numPossibleVoters    = 0;
var rollCallNumYeas      = 0;
var rollCallNumNays      = 0;
var rollCallNumAbstains  = 0;

var hasMadeNewDelegate = false;

function getDelegatePresenseNodes() {
    return $("#normalDelegateList > button").toArray().concat($("#customDelegateList > button").toArray());
}

function recalcDelegates() {
    numDelegatesInCommittee = 0;
    listOfPresentCountries = [];
    getDelegatePresenseNodes().forEach((e) => {
        if(typeof e.getAttribute != "undefined") {
            var isc = e.getAttribute("data-isclicked") == "true";
            if(isc) {
                numDelegatesInCommittee++;
                document.getElementById("attendanceNode" + e.textContent.replaceAll(" ", "")).style.display = "block";

                listOfPresentCountries.push(e.textContent);
            } else {
                document.getElementById("attendanceNode" + e.textContent.replaceAll(" ", "")).style.display = "none";
            }
        }
    })
    document.getElementById("numberOfDelegates").textContent = numDelegatesInCommittee + " Delegate" + (numDelegatesInCommittee == 1 ? "" : "s");
    document.getElementById("simpleMajorityLabel").textContent = `${Math.ceil((numDelegatesInCommittee+0.1)/2)}/${numDelegatesInCommittee}`;
    document.getElementById("twoThirdsLabel").textContent = `${Math.ceil(numDelegatesInCommittee*2/3)}/${numDelegatesInCommittee}`;
    if(numDelegatesInCommittee == 0) {
        document.getElementById("simpleMajorityLabel").textContent = "0/0";
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
        $("#quitPopup").text("Discard");
        $("#exitPopup").css("display", "inline");
        $("#popupPage").css("user-select", "");

        $("#popupPage").animate({
            opacity : 1
        }, 150);

        $("#quitPopup").css("display", "");

        isPopupShown = true;
    }
}

function resortMotions() {
    var listedMotions = $("#motiondisplays").children().get();
    listedMotions.sort(function(first, second) {
        return motionTypeToImportance(first) < motionTypeToImportance(second);
    });
    $.each(listedMotions, function(first, second) {
        $("#motiondisplays").append(second);
    })
}

function appendMotion(m) {
    if($("#firstMotionPrompt").length) $("#firstMotionPrompt").remove();

    m.find("input").toArray().forEach(function(el) {
        $(el).on("change", resortMotions);
    });

    m.attr("id", "");

    m.appendTo("#motiondisplays");

    var ph = m.css("height");
    var pp = m.css("padding");
    var pmt = m.css("margin-top");
    var pmb = m.css("margin-bottom");

    m.css("opacity", "0");

    m.css("height", "0");
    m.css("padding", "0");
    m.css("margin-top", "0");
    m.css("margin-bottom", "0");

    m.animate({
        opacity : 1,
        height : ph,
        padding : pp,
        "margin-top" : pmt,
        "margin-bottom" : pmb
    }, 150);

    resortMotions();
}

function addAttendanceNodes() {
    getListOfCountries().forEach(function(v) {
        var cont = $("#attendanceButtonsPrefab").clone(true);
        cont.children("p").get(0).textContent = v;
        cont.attr("id", "attendanceNode" + v.replaceAll(" ", ""));
        cont.children("button").get(0).click();

        $("#attendanceListOfCountries").append(cont);
    });
}

function refreshAttendanceNodes() {
    let t = getAttendanceRecord();
    $("#attendanceListOfCountries > *").remove();
    addAttendanceNodes();
    implementAttendanceList(t);
}

function implementAttendanceList(att) {
    Object.keys(att).forEach((country) => {
        var tan = $("#attendanceNode" + country.replaceAll(" ", ""));
        if(att[country] == "Pr") {
            tan.children("button").get(1).click();
        } else if(att[country] == "Pr&V") {
            tan.children("button").get(2).click();
        }
    });
}

function hidePopup() {
    if(isPopupShown) {
        if(document.getElementById("newModPopup").style.display != "none") { // Check if inputs are valid
            if(isNaN($("#newModPopupDuration").val().replaceAll(":","").replaceAll(" "))) {
                createAlert("Invalid duration");
                return
            }
            if(stringToDuration($("#newModPopupDuration").val()) <= 0) {
                createAlert("Duration can't be zero");
                return;
            }
            if(isNaN($("#newModPopupDelegateDuration").val().replaceAll(":","").replaceAll(" "))) {
                createAlert("Invalid delegate duration");
                return
            }
            if(stringToDuration($("#newModPopupDelegateDuration").val()) <= 0) {
                createAlert("Duration can't be zero");
                return;
            }
            if(Math.floor( stringToDuration($("#newModPopupDuration").val()) / stringToDuration($("#newModPopupDelegateDuration").val()) ) > numDelegatesInCommittee) {
                createAlert("You don't have enough delegates in committee to make such a mod");
                return;
            }
        } else if(document.getElementById("newUnmodPopup").style.display != "none") {
            if(isNaN($("#newUnmodPopupDuration").val().replaceAll(":","").replaceAll(" "))) {
                createAlert("Invalid duration");
                return;
            }
            if(stringToDuration($("#newUnmodPopupDuration").val()) <= 0) {
                createAlert("Duration can't be zero");
                return;
            }
        } else if(document.getElementById("speakersListPopup").style.display != "none") {
            if(isNaN($("#speakersListNumDelegates").val()) || Number($("#speakersListNumDelegates").val()) <= 0) {
                createAlert("Invalid number of delegates");
                return;
            }
            if(isNaN($("#speakersListPopupDelegateDuration").val().replaceAll(":","").replaceAll(" "))) {
                createAlert("Invalid delegate duration");
                return;
            }
            if(stringToDuration($("#speakersListPopupDelegateDuration").val()) <= 0) {
                createAlert("Duration can't be zero");
                return;
            }
            if($("#speakersListNumDelegates").val() > numDelegatesInCommittee) {
                createAlert("You don't have enough delegates in committee to open such a speakers list");
                return;
            }
        } else if(document.getElementById("roundRobinPopup").style.display != "none") {
            if(isNaN($("#roundRobinDelegateDuration").val().replaceAll(":","").replaceAll(" "))) {
                createAlert("Invalid duration");
                return;
            }
            if(stringToDuration($("#roundRobinDelegateDuration").val()) <= 0)
            createAlert("Duration can't be zero");
        }

        if(document.getElementById("editDelegateList").style.display != "none") {
            refreshAttendanceNodes();
            
            recalcDelegates();
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

        quitPopup();
    }
}

function quitPopup() {
    if(isPopupShown) {
        isPopupShown = false;

        $("#popupPage").animate({
            opacity : 0
        }, 150, (_e) => {
            $("#popupPage").css("display", "none");
            $("#popupPage > *").css("display", "none");
            $("#popupPage").css("user-select", "none");
        });

        $(":focus").blur();
    }
}

function killMotionDisplayParent(el) {
    var parentEl = $(el);

    parentEl.css('overflow','hidden');
    parentEl.animate({
        height : 0,
        opacity : 0,
        "margin-top" : 0,
        "margin-bottom" : 0,
        padding: 0
    }, 150, (_e) => {
        parentEl.remove()
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
    if(ty == "mod") {
        building["motionType"] = "mod";
        building["fancyMotionTitle"] = "Moderated Caucus";

        building["requiresDelegateList"] = true;
        building["timerType"] = "perDelegate";

        var inputs = parentEl.getElementsByTagName("input");
        building["motionTopic"] = inputs[0].value;
        building["duration"] = stringToDuration(inputs[1].value);
        building["delegateDuration"] = stringToDuration(inputs[2].value);
    } else if(ty == "unmod") {
        building["motionType"] = "unmod";
        building["fancyMotionTitle"] = "Unmoderated Caucus";

        building["requiresDelegateList"] = false;
        building["timerType"] = "one";

        var inputs = parentEl.getElementsByTagName("input");
        building["motionTopic"] = inputs[0].value;
        building["duration"] = stringToDuration(inputs[1].value);
    } else if(ty == "speakersList") {
        building["motionType"] = "speakersList";
        building["fancyMotionTitle"] = "Speakers List";

        building["motionTopic"] = "";

        building["requiresDelegateList"] = true;
        building["timerType"] = "perDelegate";

        var inputs = parentEl.getElementsByTagName("input");
        building["duration"] = Number(inputs[0].value) * stringToDuration(inputs[1].value);
        building["delegateDuration"] = stringToDuration(inputs[1].value);
    } else if(ty == "roundRobin") {
        building["motionType"] = "roundRobin";
        building["fancyMotionTitle"] = "Round Robin";

        building["requiresDelegateList"] = false;
        building["timerType"] = "perDelegate";

        var inputs = parentEl.getElementsByTagName("input");
        building["duration"] = numDelegatesInCommittee * stringToDuration(inputs[1].value);
        building["delegateDuration"] = stringToDuration(inputs[1].value);
        building["motionTopic"] = inputs[0].value;
    }
    return building;
}

function passMotion(parentEl) {
    parsePassedMotionJSON(constructJSON(parentEl));
}

function parsePassedMotionJSON(details) {
    currentMotion = details;

    if(details["requiresDelegateList"] == true) {
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
        animation: 150
    });

    if(details["requiresDelegateList"]) {
        $("#chosenCountriesForTimer").css("display", "");

        $("#chosenCountriesForTimer > *").remove();
        listOfPresentCountries.forEach(function(val) {
            $(`<button class="countryListOne outlineddiv">${val}</button>`).css("display", "block").css("width", "100%").attr("id", "modCaucusCountryChooser" + val.replaceAll(" ", "")).on("click", modCountryChooserClickEventFunctionResponder).appendTo($("#passedMotionCountryChooser"));
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

        $("#rightbottomarea").css("display", "");
        $("#rightbottomarea").css("opacity", "0");

        $("#rightbottomarea").animate({
            opacity : 1
        });
    });
    //$("#passedMotionDetails").css("display", "none");
    //$("#leftbottomarea").css("display", "none");

    refreshTimer();
    $(":focus").blur();
    isTimerHalted = false;
}

$("#newMod").on("click", function(_event) {
    if(numDelegatesInCommittee == 0) {
        createAlert('You have not chosen any delegates to be in committee. Click "Edit List" to do so.', (_e) => {
            $("#editdelegatelistbutton").click()
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

document.getElementById("editdelegatelistbutton").onclick = function(_event) {
    showPopup();
    bigPopup();
    document.getElementById("editDelegateList").style.display = "block";
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
        bigPopup();
        document.getElementById("attendanceList").style.display = "block";
        $("#attendanceList").css("height", "60%");
        document.getElementById("quitPopup").style.display = "none";
    }
};

const introducePapersJSONConfig = {
    "motionType":           "presentPapers",
    "fancyMotionTitle":     "Introduce Papers",
    "requiresDelegateList":  false,
    "timerType":            "none",
    "motionTopic":          ""
};

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
    showPopup();
    document.getElementById("roundRobinPopup").style.display = "block";
    document.getElementById("roundRobinTopic").value = "";
    $("#roundRobinDelegateDuration").val("0:15")

    document.getElementById("roundRobinTopic").focus()
}

function refreshDelegateListSearch(_e_ = null) {
    setTimeout(() => {
        var t = document.getElementById("delegateListSearch").value.toLowerCase();
        getDelegatePresenseNodes().forEach((e) => {
            if(typeof e.style != "undefined") {
                if(e.textContent.toLowerCase().includes(t)) {
                    e.style.display = "";
                } else {
                    e.style.display = "none";
                }
            }
        });
    }, 0.1);
}

document.getElementById("delegateListSearch").oninput = refreshDelegateListSearch;

document.onkeydown = function(event) {
    if(document.getElementById("delegateListSearch") == document.activeElement) refreshDelegateListSearch();
    else if(!isPopupShown && (document.activeElement == document.body)) {
        if(event.key == "m") document.getElementById("newMod").click();
        if(event.key == "e") document.getElementById("editdelegatelistbutton").click();
        if(event.key == "i" && event.ctrlKey) {
            $("#UNLogo").attr("src", "/me.png");
            return false;
        }
        if(event.key == "Escape") $("#alertContainer").css("display", "none");
    } else if(isPopupShown) {
        if(event.key == "Enter") {
            $("#exitPopup").trigger("click");
            $("#exitPopup").blur();
        }
    }
    if(event.key == "Escape") {
        if(document.getElementById("quitPopup").style.display == "none") hidePopup();
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
}

function refreshTimer(e=true) {
    if(e) {
        if(isLargeTimerGoing && document.getElementById("oneLargeTimerContainer").style.display != "none" && document.getElementById("rightbottomarea").style.display != "none") {
            largeTimerCurrentTime--;
            if(largeTimerCurrentTime <= 0) {
                largeTimerCurrentTime = 0;
    
                moveToNextDelegate();
            }
        }
    }
    document.getElementById("oneLargeTimer").textContent = timeToString(largeTimerCurrentTime);

    $("#chosenCountriesForTimer").children().css("background-color", "white");
    $($("#chosenCountriesForTimer").children()[perDelegateCurrentPosition]).css("background-color", "powderblue");

    $("#modDelegateIndexSpan").text(perDelegateCurrentPosition+1);
}

function endCurrentMotion() {
    stopTimer();
    $("#rightbottomarea").css("display", "none");
    $("#leftbottomarea").css("display", "");

    $("#exitCurrentMotion").css("display", "none");
    $("#newmotions").css("display", "block");

    currentMotion = null;

    document.getElementById("motiondisplays").childNodes.forEach((el) => {
        el.remove();
    });

    $("#passedMotionCountryChooser > *").remove();
}

function setCurrentCountryList(newList) {
    getDelegatePresenseNodes().forEach((el) => {
        $(el).remove();
    })
    getListOfCountries().forEach(function(v) {
        var cb = document.createElement("button");
        cb.classList.add("countryListOne");
        cb.setAttribute("data-isclicked", "false");
        cb.textContent = v;
        cb.onclick = changeClickedEventResponder;
        
        $("#normalDelegateList").append(cb);

        if(newList.includes(v)) {
            cb.click();
        }
    });
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
            $("#modCaucusCountryChooser" + this.textContent.replaceAll(" ", "")).css("display", "");

            this.remove();

            refreshModCountryList();
        }
    }).append(`<p>${this.textContent}</p>`).appendTo($("#chosenCountriesForTimer"));

    $(this).css("display", "none");

    refreshModCountryList();
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

function bigPopup() {
    $("#popupPage").css("top", "-15%");
    $("#popupPage").css("height", "115%");
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

window.onload = function(_event) {
    $("#committeeName").val("");
    $("#newDelegateInput").val("");

    addAttendanceNodes();

    document.getElementById("rightbottomarea").style.display = "none";

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

    /*$("#motiondisplays").sortable({
        animation: 100
    });**/

    setInterval(refreshTimer, 1000);

    $("#bottomarea").css("display", "block");

    $("#UNLogo").on("dragstart", function(_e) {
        return false;
    });

    $("#commenceRollCall").on("click", function(_e) {
        $("#rollCallButtonContainer > *").prop("disabled", false);
        votingListThing = {};
        getListOfCountries().forEach(function(v) {
            if(document.getElementById("attendanceNode" + v.replaceAll(" ", "")).style.display != "none") {
                var buttons = document.getElementById("attendanceNode" + v.replaceAll(" ", "")).getElementsByTagName("button");
                if(buttons[1].getAttribute("data-clicked") == "true") {
                    votingListThing[v] = ["No Vote", "Pr"];
                } else if(buttons[2].getAttribute("data-clicked") == "true") {
                    votingListThing[v] = ["No Vote", "Pr&V"];
                }
            }
        });
        
        numPossibleVoters = Object.keys(votingListThing).length;
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
        if(numPossibleVoters == 0) {
            createAlert("Take attendance before taking a roll call vote");
            return;
        }

        $("#rollCallPastChoices > *").remove();

        Object.entries(votingListThing).forEach(function(el) {
            $("#rollCallPastChoices").append(
                $("<div></div>").append($(`<p class="expandAllTheWay">${el[0]}</p>`)).append($(`<p class="expandAllTheWay entireLineHeight">No Vote</p>`))
            )
        });

        showPopup();
        bigPopup();
        $("#rollCallVotePopup").css("display", "block");
        $("#quitPopup").text("Close");
        $("#exitPopup").css("display", "none");

        rollCallCurrentVoter = 0;
        rollCallNumNays      = 0;
        rollCallNumYeas      = 0;
        rollCallNumAbstains  = 0;
        hasRollCallFinished  = false;

        $("#rollCallNumVotesNeededToWin").text(Math.ceil((numPossibleVoters+1)/2))

        $($(`#rollCallPastChoices`).children().toArray()[rollCallCurrentVoter]).css("background-color", "powderblue");

        $("#rollCallCountryName").text(Object.entries(votingListThing)[rollCallCurrentVoter][0]);
        $("#rollCallVoterAttendance").text(
            Object.entries(votingListThing)[rollCallCurrentVoter][1][1] == "Pr" ? "Present" : "Present and Voting"
        );

        if(Object.entries(votingListThing)[rollCallCurrentVoter][1][1] == "Pr") {
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

        $(`#rollCallPastChoices`).children().toArray()[0].scrollIntoView();
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
            url     : "https://mun.alex-seltzer.com/savesavedata",
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
            url     : "https://mun.alex-seltzer.com/mun/getsavedata",
            contentType: 'application/json',
            success : function(returned) {
                implementStateJSON(returned);
            },
            error   : function(returned) {
                createAlert(JSON.parse(returned));
                console.log(returned);
            },
            data    : JSON.stringify(d)
        });
        quitPopup();
    });

    $("#logoContainer").on("click", function(_e) {
        if(isPopupShown) return;
        showPopup();
        bigPopup();
        $("#legalStuffEwww").css("display", "block").css("height", "60%");
        $("#quitPopup").text("Close");
        $("#exitPopup").css("display", "none");
    });

    $("#newDelegateSubmit").on("click", function(_e) {
        if($("#newDelegateInput").val() == "") return;

        customDelegates.push($("#newDelegateInput").val());

        var cb = $("<button>");
        cb.addClass("countryListOne");
        cb.attr("data-isclicked", "false");
        cb.text($("#newDelegateInput").val());
        cb.on("click", changeClickedEventResponder);
        
        $("#customDelegateList").append(cb);

        $("#newDelegateInput").val("");

        hasMadeNewDelegate = true;
    });

    $("#impromptuTimerButton").on("click", function(_e) {
        if(isPopupShown) return;
        showPopup();
        bigPopup();
        $("#impromptuTimer").css("display", "block").css("height", "60%");
        $("#exitPopup").css("display", "none");
        $("#quitPopup").text("Close");
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
        if(isNaN($("#impromptuTimerLabel").val().replaceAll(":",""))) {
            $("#impromptuTimerLabel").val("5:00");
        }
        impromptuTime = stringToDuration($("#impromptuTimerLabel").val());
        originalImpromptuTime = impromptuTime;
    });
    $("#impromptuTimerReset").on("click", function(_e) {
        impromptuTime = originalImpromptuTime;
        isImpromptuTimerGoing = false;
        $("#impromptuTimerLabel").val(durationToString(impromptuTime));
    });
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
        }
    }, 1000);

    $("#impromptuTimerLabel").val("5:00");

    setCurrentCountryList([]);
    recalcDelegates();
}

var isImpromptuTimerGoing = false;
var impromptuTime         = 300;
var originalImpromptuTime = 300;

var hasRollCallFinished = false;

function goToNextRollCallVote(proceeds=true) { // It's best to not look at this function for too long
                                               // If proceeds is false, it just updates the view
    if(hasRollCallFinished) {
        return;
    }
    $($(`#rollCallPastChoices`).children().toArray()[rollCallCurrentVoter]).css("background-color", "");
    if(proceeds) rollCallCurrentVoter++;
    if(rollCallCurrentVoter == numPossibleVoters) {
        rollCallCurrentVoter--;
        hasRollCallFinished = true;
    }
    $($(`#rollCallPastChoices`).children().toArray()[rollCallCurrentVoter]).css("background-color", "powderblue");

    $(`#rollCallPastChoices`).children().toArray()[rollCallCurrentVoter].scrollIntoView({behavior: "smooth"});

    $("#rollCallCountryName").text(Object.entries(votingListThing)[rollCallCurrentVoter][0]);
    $("#rollCallVoterAttendance").text(
        Object.entries(votingListThing)[rollCallCurrentVoter][1][1] == "Pr" ? "Present" : "Present and Voting"
    );

    if(Object.entries(votingListThing)[rollCallCurrentVoter][1][1] == "Pr") {
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
        $("#rollCallPastChoices > *").css("background-color", "");
    }
}

$("#rollCallYeaButton").on("click", function(_e) {
    if(!hasRollCallFinished) {
        $($(`#rollCallPastChoices`).children().toArray()[rollCallCurrentVoter]).children().toArray()[1].textContent = "Yea";
        rollCallNumYeas++;
    }
    goToNextRollCallVote();
});

$("#rollCallNayButton").on("click", function(_e) {
    if(!hasRollCallFinished) {
        $($(`#rollCallPastChoices`).children().toArray()[rollCallCurrentVoter]).children().toArray()[1].textContent = "Nay";
        rollCallNumNays++;
    }
    goToNextRollCallVote();
});

$("#rollCallAbstainButton").on("click", function(_e) {
    if(!hasRollCallFinished) {
        rollCallNumAbstains++;
        $($(`#rollCallPastChoices`).children().toArray()[rollCallCurrentVoter]).children().toArray()[1].textContent = "Abstain";
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

function getAttendanceRecord() {
    var toReturn = {};
    listOfPresentCountries.forEach((el) => {
        var tel = document.getElementById("attendanceNode" + el.replaceAll(" ", "")).getElementsByTagName("button");
        var state = "";
        if(tel[0].getAttribute("data-clicked") == "true") {
            state = "A";
        } else if(tel[1].getAttribute("data-clicked") == "true") {
            state = "Pr";
        } else {
            state = "Pr&V";
        }
        toReturn[el] = state;
    });
    return toReturn;
}

function getStateJSON() {
    var toReturn = {
        committeeName : $("#committeeName").val(),

        customDelegates : customDelegates,

        attendance: {
            // Ex. "United States" : "PV"
        },

        proposedMotions: [

        ],

        isThereACurrentMotion : $("#rightbottomarea").css("display") != "none",

        isThereARollCall      : $("#rollCallVotePopup").css("display") == "block",

        currentMotion : {

        },

        rollCallDetails : {
            listOfVotes : [

            ]
        }
    };

    toReturn.attendance = getAttendanceRecord();

    $("#motiondisplays").children().each(function(e) {
        if(this.nodeName != "DIV") return;
        var t = {};
        t["type"] = this.getAttribute("data-motiontype");
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

function implementStateJSON(newState) {
    console.log(newState);
    $("#motiondisplays > *").remove();
    if(isPopupShown) quitPopup();

    setCurrentCountryList(Object.keys(newState.attendance));
    $("#allAbsentButton").click();
    recalcDelegates();

    customDelegates = newState.customDelegates;

    $("#committeeName").val(newState.committeeName);

    implementAttendanceList(newState.attendance);

    if(!newState.isThereACurrentMotion) {
        for(var i = 0; i < newState.proposedMotions.length; i++) {
            var cm = newState.proposedMotions[i];
            if(cm.type == "mod") {
                var toAdd = $("#modMotionPrefab").clone(true);
                var inputList = toAdd.find("input");
                inputList[0].value = cm.topic;
                inputList[1].value = durationToString(cm.totalDuration);
                inputList[2].value = durationToString(cm.delegateDuration);

                appendMotion(toAdd);
            } else if(cm.type == "unmod") {
                var toAdd = $("#unmodMotionPrefab").clone(true);
                var inputList = toAdd.find("input");
                inputList[0].value = cm.topic;
                inputList[1].value = durationToString(cm.duration);

                appendMotion(toAdd);
            } else if(cm.type == "roundRobin") {
                var toAdd = $("#roundRobinMotionPrefab").clone(true);
                var inputList = toAdd.find("input");
                inputList[0].value = cm.topic;
                inputList[1].value = durationToString(cm.delegateDuration);

                appendMotion(toAdd);
            } else if(cm.type == "speakersList") {
                var toAdd = $("#speakersListMotionPrefab").clone(true);
                var inputList = toAdd.find("input");
                inputList[0].value = cm.numberOfSpeakers;
                inputList[1].value = durationToString(cm.delegateDuration);

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
                $("#modCaucusCountryChooser" + el.replaceAll(" ", "")).click();
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