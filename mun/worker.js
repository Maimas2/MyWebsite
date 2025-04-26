// Licensed under GPLv3

// Mmm spaghetti and meatballs

// Libraries used:
// - ExpressJS
// - SortableJS
// - jQuery
// - body-parser
// - jQuery-sortablejs
// - vHost

{
    var listOfCountries = new Array("Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei Darussalam", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Cote d'Ivoire", "Croatia", "Cuba", "Cyprus", "Czechia", "North Korea", "Democratic Republic of the Congo (DRC)", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Lao People's Democratic Republic", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Republic of Korea", "Republic of Moldova", "Romania", "Russian Federation", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syrian Arab Republic", "Tajikistan", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Türkiye", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United Republic of Tanzania", "United States of America", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Viet Nam", "Yemen", "Zambia", "Zimbabwe", "Holy See");
}

var listOfPresentCountries = [];

var isPopupShown = false;
var numDelegatesInCommittee = 0;

var currentMotion = null;

var largeTimerCurrentTime = 0; // Current display time in seconds. No fractional part.
var isLargeTimerGoing = false; // Whether the timer is currently going
var largeTimerOriginalDuration = 0; // In mods, the original duration, not per delegate
var largeTimerNumDelegates = 0; // Number of delegates that will speak

var perDelegateCurrentPosition = 1; // Number delegate of the speakers in the mod

var canSortChosenCountries = true;

var isTimerHalted = false;

var votingListThing = {

};
var rollCallCurrentVoter = 0;
var numPossibleVoters    = 0;
var rollCallNumYeas      = 0;
var rollCallNumNays      = 0;
var rollCallNumAbstains  = 0;

function recalcDelegates() {
    numDelegatesInCommittee = 0;
    document.getElementById("attendanceAlert").style.display = "none";
    listOfPresentCountries = [];
    document.getElementById("innerDelegateList").childNodes.forEach((e) => {
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
    document.getElementById("numberOfDelegates").textContent = numDelegatesInCommittee;
    document.getElementById("simpleMajorityLabel").textContent = `${Math.ceil((numDelegatesInCommittee+0.1)/2)}/${numDelegatesInCommittee}`;
    document.getElementById("twoThirdsLabel").textContent = `${Math.ceil(numDelegatesInCommittee*2/3)}/${numDelegatesInCommittee}`;
    if(numDelegatesInCommittee == 0) {
        document.getElementById("simpleMajorityLabel").textContent = "0/0";
        document.getElementById("attendanceAlert").style.display = "block";
    }
}

function showPopup() {
    if(!isPopupShown) {
        document.getElementById("popupPage").childNodes.forEach(function(element) {
            if(typeof element.style != "undefined") {
                element.style.display = "none";
            }
        });

        document.getElementById("popupPage").style.opacity = "1";
        document.getElementById("popupPage").style.display = "block";
        $("#popupPage").css("top", "0");
        $("#popupPage").css("height", "100%");
        $("#quitPopup").text("Discard");
        $("#exitPopup").css("display", "inline");

        document.getElementById("quitPopup").style.display = "";

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

    m.appendTo("#motiondisplays");

    resortMotions();
}

function hidePopup() {
    if(isPopupShown) {
        if(document.getElementById("editDelegateList").style.display != "none") {
            recalcDelegates();

            let ddd = {
                list: listOfPresentCountries
            };
            let d = JSON.stringify(ddd);

            $.ajax({
                type: 'POST',
                url: 'setcountrylist',
                data: d,
                contentType: 'application/json',
                success: function(response) {
                    //console.log(response);
                },
                error: function(xhr, status, error) {
                    console.error(xhr, status, error);
                }
            });
        } else if(document.getElementById("newModPopup").style.display != "none") {
            var toAdd = $("#modMotionPrefab").clone(true);
            var inputList = toAdd.find("input");
            inputList[0].value = $("#newModTopic").val();
            inputList[1].value = $("#newModPopupDuration").val();
            inputList[2].value = $("#newModPopupDelegateDuration").val();
            if(isNaN(inputList[1].value.replaceAll(":","").replaceAll(" "))) inputList[1].value = "5:00";

            appendMotion(toAdd);
        } else if(document.getElementById("newUnmodPopup").style.display != "none") {
            var toAdd = $("#unmodMotionPrefab").clone(true);
            var inputList = toAdd.find("input");
            inputList[0].value = $("#newUnmodTopic").val();
            inputList[1].value = $("#newUnmodPopupDuration").val();
            if(isNaN(inputList[1].value.replaceAll(":","").replaceAll(" "))) inputList[1].value = "5:00";

            appendMotion(toAdd);
        } else if(document.getElementById("speakersListPopup").style.display != "none") {
            var toAdd = $("#speakersListMotionPrefab").clone(true);
            var inputList = toAdd.find("input");
            inputList[0].value = $("#speakersListNumDelegates").val();
            inputList[1].value = $("#speakersListPopupDelegateDuration").val();
            if(isNaN(inputList[1].value.replaceAll(":","").replaceAll(" "))) inputList[1].value = "5:00";

            appendMotion(toAdd);
        } else if(document.getElementById("roundRobinPopup").style.display != "none") {
            var toAdd = $("#roundRobinMotionPrefab").clone(true);
            var inputList = toAdd.find("input");
            inputList[0].value = $("#roundRobinTopic").val();
            inputList[1].value = $("#roundRobinDelegateDuration").val();
            if(isNaN(inputList[1].value.replaceAll(":","").replaceAll(" "))) inputList[1].value = "0:15";

            appendMotion(toAdd);
        }

        quitPopup();
    }
}

function quitPopup() {
    if(isPopupShown) {
        isPopupShown = false;

        document.getElementById("popupPage").style.display = "none";

        $(":focus").blur();
    }
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

    $("#rightbottomarea").css("display", "");
    setTimeout(function(_e) {$("#rightbottomarea").css("opacity", "1");}, 1);

    document.getElementById("exitCurrentMotionContainer").style.display = "block";

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

    $("#motiondisplays").css("opacity", "0");
    setTimeout(function(_e) {
        $("#motiondisplays > *").remove();
        $("#motiondisplays").css("opacity", "1");
    }, 300);

    refreshTimer();
    $(":focus").blur();
    isTimerHalted = false;
}

document.getElementById("newMod").onclick = function(_event) {
    showPopup();
    document.getElementById("newModPopup").style.display = "block";
    document.getElementById("newModTopic").value = "";
    document.getElementById("newModPopupDuration").value = "5:00";
    document.getElementById("newModPopupDelegateDuration").value = "1:00";

    document.getElementById("newModTopic").focus()
}

document.getElementById("newSpeakersList").onclick = function(_event) {
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
    showPopup();
    document.getElementById("roundRobinPopup").style.display = "block";
    document.getElementById("roundRobinTopic").value = "";
    $("#roundRobinDelegateDuration").val("0:15")

    document.getElementById("roundRobinTopic").focus()
}

function refreshDelegateListSearch(_e_ = null) {
    setTimeout(() => {
        var t = document.getElementById("delegateListSearch").value.toLowerCase();
        document.getElementById("innerDelegateList").childNodes.forEach((e) => {
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
    else if(!isPopupShown && document.activeElement == document.body) {
        if(event.key == "m") document.getElementById("newMod").click();
        if(event.key == "e") document.getElementById("editdelegatelistbutton").click();
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

function createAlert(message) {
    $("#alertContainer").css("display", "flex");
    $("#alertText").text(message);
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
            $("#chosenCountriesForTimer").children().css("background-color", "white");
            $($("#chosenCountriesForTimer").children()[perDelegateCurrentPosition]).css("background-color", "powderblue");

            $("#modDelegateIndexSpan").text(perDelegateCurrentPosition+1);

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
}

function endCurrentMotion() {
    stopTimer();
    $("#rightbottomarea").css("opacity", "0");
    setTimeout(function(_e) {
        $("#rightbottomarea").css("display", "none");
    }, 300);
    document.getElementById("exitCurrentMotionContainer").style.display = "none";

    currentMotion = null;

    document.getElementById("motiondisplays").childNodes.forEach((el) => {
        el.remove();
    });

    $("#passedMotionCountryChooser > *").remove();
}

function setCurrentCountryList(newList) {
    $("#innerDelegateList > *").remove();
    listOfCountries.forEach(function(v) {
        var cb = document.createElement("button");
        cb.classList.add("countryListOne");
        cb.setAttribute("data-isclicked", "false");
        cb.textContent = v;
        cb.onclick = changeClickedEventResponder;
        
        $("#innerDelegateList").append(cb);

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
        $(".pleaseRemoveMeDaddy").css("display", "none");
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

window.onload = function(_event) {
    $.ajax({
        url: "getcountrylist",
        success: function(res) {
            setCurrentCountryList(res["list"]);
            recalcDelegates();
        }
    });

    listOfCountries.forEach(function(v) {
        var cont = document.getElementById("attendanceButtonsPrefab").cloneNode(true);
        cont.childNodes[1].textContent = v;
        cont.id = "attendanceNode" + v.replaceAll(" ", "");
        cont.childNodes[3].click();

        document.getElementById("attendanceListOfCountries").appendChild(cont);
        //document.getElementById("attendanceListOfCountries").appendChild(document.createElement("br"));
    });

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
        votingListThing = {};
        listOfCountries.forEach(function(v) {
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
        if(numPossibleVoters == 0) {
            createAlert("There are no eligable voters!");
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
}

var hasRollCallFinished = false;

function goToNextRollCallVote() { // It's best to not look at this function for too long
    if(hasRollCallFinished) {
        return;
    }
    $($(`#rollCallPastChoices`).children().toArray()[rollCallCurrentVoter]).css("background-color", "");
    rollCallCurrentVoter++;
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
        // Tell them that they're done
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

function getStateJSON() {
    var toReturn = {
        attendance: {
            // Ex. "United States" : "PV"
        },

        proposedMotions: [

        ],

        isThereACurrentMotion: $("#rightbottomarea").css("display") != "none",

        currentMotionEdit: {

        }
    };

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
        toReturn["attendance"][el] = state;
    });

    $("#motiondisplays").children().each(function(e) {
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

    return toReturn;
}

function implementStateJSON(newState) {
    $("#motiondisplays > *").remove();

    
}