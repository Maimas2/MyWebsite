// Licensed under GPLv3

// Dunno why you'd want to redistribute, this code is SO shitty

// Libraries used:
// - ExpressJS
// - SortableJS
// - jQuery
// - jQuery-sortablejs
// - body-parser (backend)
// - vHost       (backend)


const basicListOfCountries = {"Afghanistan" : "af", "Albania" : "al", "Algeria" : "dz", "Andorra" : "ad", "Angola" : "ao", "Antigua and Barbuda" : "ag", "Argentina" : "ar", "Armenia" : "am", "Australia" : "au", "Austria" : "at", "Azerbaijan" : "az", "Bahamas" : "bs", "Bahrain" : "bh", "Bangladesh" : "bd", "Barbados" : "bb", "Belarus" : "by", "Belgium" : "be", "Belize" : "bz", "Benin" : "bj", "Bhutan" : "bt", "Bolivia" : "bo", "Bosnia and Herzegovina" : "ba", "Botswana" : "bw", "Brazil" : "br", "Brunei Darussalam" : "bn", "Bulgaria" : "bg", "Burkina Faso" : "bf", "Burundi" : "bi", "Cabo Verde" : "cv", "Cambodia" : "kh", "Cameroon" : "cm", "Canada" : "ca", "Central African Republic" : "cf", "Chad" : "td", "Chile" : "cl", "China" : "cn", "Colombia" : "co", "Comoros" : "km", "Congo" : "cg", "Costa Rica" : "cr", "Ivory Coast" : "ci", "Croatia" : "hr", "Cuba" : "cu", "Cyprus" : "cy", "Czechia" : "cz", "North Korea" : "kp", "Democratic Republic of the Congo" : "cd", "Denmark" : "dk", "Djibouti" : "dj", "Dominica" : "dm", "Dominican Republic" : "do", "Ecuador" : "ec", "Egypt" : "eg", "El Salvador" : "sv", "Equatorial Guinea" : "gq", "Eritrea" : 'er', "Estonia" : "ee", "Eswatini" : "sz", "Ethiopia" : "et", "Fiji" : "fj", "Finland" : "fi", "France" : "fr", "Gabon" : "ga", "Gambia" : "gm", "Georgia" : "ge", "Germany" : "de", "Ghana" : "gh", "Greece" : "gr", "Grenada" : "gd", "Guatemala" : "gt", "Guinea" : "gn", "Guinea-Bissau" : "gw", "Guyana" : "gy", "Haiti" : "ht", "Honduras" : "hn", "Hungary" : "hu", "Iceland" : "is", "India" : "in", "Indonesia" : "id", "Iran" : "ir", "Iraq" : "iq", "Ireland" : "ie", "Israel" : "il", "Italy" : "it", "Jamaica" : "jm", "Japan" : "jp", "Jordan" : "jo", "Kazakhstan" : "kz", "Kenya" : "ke", "Kiribati" : "ki", "Kuwait" : "kw", "Kyrgyzstan" : "kg", "Laos" : "la", "Latvia" : "lv", "Lebanon" : "lb", "Lesotho" : "ls", "Liberia" : "lr", "Libya" : "ly", "Liechtenstein" : "lt", "Lithuania" : "lt", "Luxembourg" : "lu", "Madagascar" : "mg", "Malawi" : "mw", "Malaysia" : "my", "Maldives" : "mv", "Mali" : "ml", "Malta" : "mt", "Marshall Islands" : "mh", "Mauritania" : "mr", "Mauritius" : "mu", "Mexico" : "mx", "Micronesia" : "fm", "Monaco" : "mc", "Mongolia" : "mn", "Montenegro" : "me", "Morocco" : "ma", "Mozambique" : "mz", "Myanmar" : "mm", "Namibia" : "na", "Nauru" : "nr", "Nepal" : "np", "Netherlands" : "nl", "New Zealand" : "nz", "Nicaragua" : "ni", "Niger" : "ne", "Nigeria" : "ng", "North Macedonia" : "mk", "Norway" : "no", "Oman" : "om", "Pakistan" : "pk", "Palau" : "pw", "Panama" : "pa", "Papua New Guinea" : "pg", "Paraguay" : "py", "Peru" : "pe", "Philippines" : "ph", "Poland" : "pl", "Portugal" : "pt", "Qatar" : "qa", "Republic of Korea" : "kr", "Republic of Moldova" : "md", "Romania" : "ro", "Russia" : "ru", "Rwanda" : "rw", "Saint Kitts and Nevis" : "kn", "Saint Lucia" : "lc", "Saint Vincent and the Grenadines" : "vc", "Samoa" : "ws", "San Marino" : "sm", "Sao Tome and Principe" : "st", "Saudi Arabia" : "sa", "Senegal" : "sn", "Serbia" : "rs", "Seychelles" : "sc", "Sierra Leone" : "sl", "Singapore" : "sg", "Slovakia" : "sk", "Slovenia" : "si", "Solomon Islands" : "sb", "Somalia" : "so", "South Africa" : "za", "South Sudan" : "ss", "Spain" : "es", "Sri Lanka" : "lk", "Sudan" : "sd", "Suriname" : "sr", "Sweden" : "se", "Switzerland" : "ch", "Syrian Arab Republic" : "sy", "Tajikistan" : "tj", "Thailand" : "th", "Timor-Leste" : "tl", "Togo" : "tg", "Tonga" : "to", "Trinidad and Tobago" : "tt", "Tunisia" : "tn", "Turkiye" : "tr", "Turkmenistan" : "tm", "Tuvalu" : "tv", "Uganda" : "ug", "Ukraine" : "ua", "United Arab Emirates" : "ae", "United Kingdom" : "gb", "United Republic of Tanzania" : "tz", "United States of America" : "us", "Uruguay" : "uy", "Uzbekistan" : "uz", "Vanuatu" : "vu", "Venezuela" : "ve", "Vietnam" : "vn", "Yemen" : "ye", "Zambia" : "zm", "Zimbabwe" : "zw", "Holy See" : "va", "Palestine" : "ps", "African Union" : "AfricanUnion", "European Union" : "EuropeonUnion"};

const nonVotingBasicMembers = new Array("Holy See", "Palestine");

const GeneralAssemblyLoadString = '{"mySalt":"","committeeName":"[No name]","customDelegates":[],"attendance":{"Afghanistan":"Ab","Albania":"Ab","Algeria":"Ab","Andorra":"Ab","Angola":"Ab","Antigua and Barbuda":"Ab","Argentina":"Ab","Armenia":"Ab","Australia":"Ab","Austria":"Ab","Azerbaijan":"Ab","Bahamas":"Ab","Bahrain":"Ab","Bangladesh":"Ab","Barbados":"Ab","Belarus":"Ab","Belgium":"Ab","Belize":"Ab","Benin":"Ab","Bhutan":"Ab","Bolivia":"Ab","Bosnia and Herzegovina":"Ab","Botswana":"Ab","Brazil":"Ab","Brunei Darussalam":"Ab","Bulgaria":"Ab","Burkina Faso":"Ab","Burundi":"Ab","Cabo Verde":"Ab","Cambodia":"Ab","Cameroon":"Ab","Canada":"Ab","Central African Republic":"Ab","Chad":"Ab","Chile":"Ab","China":"Ab","Colombia":"Ab","Comoros":"Ab","Congo":"Ab","Costa Rica":"Ab","Ivory Coast":"Ab","Croatia":"Ab","Cuba":"Ab","Cyprus":"Ab","Czechia":"Ab","North Korea":"Ab","Democratic Republic of the Congo":"Ab","Denmark":"Ab","Djibouti":"Ab","Dominica":"Ab","Dominican Republic":"Ab","Ecuador":"Ab","Egypt":"Ab","El Salvador":"Ab","Equatorial Guinea":"Ab","Eritrea":"Ab","Estonia":"Ab","Eswatini":"Ab","Ethiopia":"Ab","Fiji":"Ab","Finland":"Ab","France":"Ab","Gabon":"Ab","Gambia":"Ab","Georgia":"Ab","Germany":"Ab","Ghana":"Ab","Greece":"Ab","Grenada":"Ab","Guatemala":"Ab","Guinea":"Ab","Guinea-Bissau":"Ab","Guyana":"Ab","Haiti":"Ab","Honduras":"Ab","Hungary":"Ab","Iceland":"Ab","India":"Ab","Indonesia":"Ab","Iran":"Ab","Iraq":"Ab","Ireland":"Ab","Israel":"Ab","Italy":"Ab","Jamaica":"Ab","Japan":"Ab","Jordan":"Ab","Kazakhstan":"Ab","Kenya":"Ab","Kiribati":"Ab","Kuwait":"Ab","Kyrgyzstan":"Ab","Laos":"Ab","Latvia":"Ab","Lebanon":"Ab","Lesotho":"Ab","Liberia":"Ab","Libya":"Ab","Liechtenstein":"Ab","Lithuania":"Ab","Luxembourg":"Ab","Madagascar":"Ab","Malawi":"Ab","Malaysia":"Ab","Maldives":"Ab","Mali":"Ab","Malta":"Ab","Marshall Islands":"Ab","Mauritania":"Ab","Mauritius":"Ab","Mexico":"Ab","Micronesia":"Ab","Monaco":"Ab","Mongolia":"Ab","Montenegro":"Ab","Morocco":"Ab","Mozambique":"Ab","Myanmar":"Ab","Namibia":"Ab","Nauru":"Ab","Nepal":"Ab","Netherlands":"Ab","New Zealand":"Ab","Nicaragua":"Ab","Niger":"Ab","Nigeria":"Ab","North Macedonia":"Ab","Norway":"Ab","Oman":"Ab","Pakistan":"Ab","Palau":"Ab","Panama":"Ab","Papua New Guinea":"Ab","Paraguay":"Ab","Peru":"Ab","Philippines":"Ab","Poland":"Ab","Portugal":"Ab","Qatar":"Ab","Republic of Korea":"Ab","Republic of Moldova":"Ab","Romania":"Ab","Russia":"Ab","Rwanda":"Ab","Saint Kitts and Nevis":"Ab","Saint Lucia":"Ab","Saint Vincent and the Grenadines":"Ab","Samoa":"Ab","San Marino":"Ab","Sao Tome and Principe":"Ab","Saudi Arabia":"Ab","Senegal":"Ab","Serbia":"Ab","Seychelles":"Ab","Sierra Leone":"Ab","Singapore":"Ab","Slovakia":"Ab","Slovenia":"Ab","Solomon Islands":"Ab","Somalia":"Ab","South Africa":"Ab","South Sudan":"Ab","Spain":"Ab","Sri Lanka":"Ab","Sudan":"Ab","Suriname":"Ab","Sweden":"Ab","Switzerland":"Ab","Syrian Arab Republic":"Ab","Tajikistan":"Ab","Thailand":"Ab","Timor-Leste":"Ab","Togo":"Ab","Tonga":"Ab","Trinidad and Tobago":"Ab","Tunisia":"Ab","Türkiye":"Ab","Turkmenistan":"Ab","Tuvalu":"Ab","Uganda":"Ab","Ukraine":"Ab","United Arab Emirates":"Ab","United Kingdom":"Ab","United Republic of Tanzania":"Ab","United States of America":"Ab","Uruguay":"Ab","Uzbekistan":"Ab","Vanuatu":"Ab","Venezuela":"Ab","Vietnam":"Ab","Yemen":"Ab","Zambia":"Ab","Zimbabwe":"Ab","Holy See":"Ab"},"proposedMotions":[],"isThereACurrentMotion":false,"isThereARollCall":false,"isImpromptuTimerOpen":false,"impromptuTime":300,"currentMotion":{},"rollCallDetails":{"listOfVotes":[]}}';

const SecurityCouncilLoadString = '{"mySalt":"","committeeName":"[No name]","customDelegates":[],"attendance":{"China":"Ab","France":"Ab","Russia":"Ab","United Kingdom":"Ab","United States of America":"Ab"},"proposedMotions":[],"isThereACurrentMotion":false,"isThereARollCall":false,"isImpromptuTimerOpen":false,"impromptuTime":300,"currentMotion":{},"rollCallDetails":{"listOfVotes":[]}}';

const G20LoadString = '{"mySalt":"","committeeName":"[No name]","dictOfCustomDelegates":{"African Union":{"canVote":true},"European Union":{"canVote":true}},"attendance":{"Argentina":"Ab","Australia":"Ab","Brazil":"Ab","Canada":"Ab","China":"Ab","France":"Ab","Germany":"Ab","India":"Ab","Indonesia":"Ab","Italy":"Ab","Japan":"Ab","Mexico":"Ab","Republic of Korea":"Ab","Russia":"Ab","Saudi Arabia":"Ab","South Africa":"Ab","Türkiye":"Ab","United Kingdom":"Ab","United States of America":"Ab","African Union":"Ab","European Union":"Ab"},"proposedMotions":[],"isThereACurrentMotion":false,"isThereARollCall":false,"isImpromptuTimerOpen":false,"impromptuTime":300,"currentMotion":{},"rollCallDetails":{"listOfVotes":[]}}';

const EuropeanUnionLoadString = '{"mySalt":"","committeeName":"[No name]","customDelegates":[],"attendance":{"Austria":"Ab","Belgium":"Ab","Bulgaria":"Ab","Croatia":"Ab","Cyprus":"Ab","Czechia":"Ab","Denmark":"Ab","Estonia":"Ab","Finland":"Ab","France":"Ab","Germany":"Ab","Greece":"Ab","Hungary":"Ab","Ireland":"Ab","Italy":"Ab","Latvia":"Ab","Lithuania":"Ab","Luxembourg":"Ab","Malta":"Ab","Netherlands":"Ab","Poland":"Ab","Portugal":"Ab","Romania":"Ab","Slovakia":"Ab","Slovenia":"Ab","Spain":"Ab","Sweden":"Ab"},"proposedMotions":[],"isThereACurrentMotion":false,"isThereARollCall":false,"isImpromptuTimerOpen":false,"impromptuTime":300,"currentMotion":{},"rollCallDetails":{"listOfVotes":[]}}';

const ASEANLoadString = '{"mySalt":"","committeeName":"[No name]","customDelegates":[],"attendance":{"Brunei Darussalam":"Ab","Cambodia":"Ab","Indonesia":"Ab","Laos":"Ab","Malaysia":"Ab","Myanmar":"Ab","Philippines":"Ab","Singapore":"Ab","Thailand":"Ab","Vietnam":"Ab"},"proposedMotions":[],"isThereACurrentMotion":false,"isThereARollCall":false,"isImpromptuTimerOpen":false,"impromptuTime":300,"currentMotion":{},"rollCallDetails":{"listOfVotes":[]}}';

const NothingSaveFile = '{"mySalt":"","committeeName":"[No name]","dictOfCustomDelegates":{},"attendance":{},"proposedMotions":[],"isThereACurrentMotion":false,"isThereARollCall":false,"isImpromptuTimerOpen":false,"impromptuTime":300,"currentMotion":{},"rollCallDetails":{"listOfVotes":[]}}';

var dictOfBasicDelegates = {

};

var dictOfCustomDelegates = {

};

function isBasicMember(str) {
    return String(basicListOfCountries[str]).length == 2;
}

function hasBasicFlag(str) {
    return String(basicListOfCountries[str]) != "undefined" && String(basicListOfCountries[str]).length > 0;
}

function dictOfDelegates() {
    let t = {};
    Object.keys(dictOfBasicDelegates).forEach((el) => {
        t[el] = dictOfBasicDelegates[el];
    });
    Object.keys(dictOfCustomDelegates).forEach((el) => {
        t[el] = dictOfCustomDelegates[el];
    });
    return t;
}

function getListOfCountries() {
    return Object.keys(dictOfBasicDelegates).concat(Object.keys(dictOfCustomDelegates)).sort();
}

function getAttendanceOfPresentCountries() {
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

function getAttendanceOfVotingCountries() {
    let t = getAttendanceOfPresentCountries();
    let toReturn = {  };
    let tdict = dictOfDelegates();
    Object.keys(t).forEach((el) => {
        if(tdict[el].canVote) {
            toReturn[el] = t[el];
        }
    });
    return toReturn;
}

function getListOfPresentCountries() {
    var d = getAttendanceOfPresentCountries();
    var toReturn = [];
    Object.keys(d).forEach(function(el) {
        if(d[el] != "Ab") toReturn.push(el);
    });
    return toReturn.sort();
}

function getListOfVotingCountries() {
    var d = getAttendanceOfVotingCountries();
    var toReturn = [];
    Object.keys(d).forEach(function(el) {
        if(d[el] != "Ab") toReturn.push(el);
    });
    return toReturn.sort();
}

var listOfCountriesInCommittee = []; // Only labelled as in committee, not necessarily present
var numDelegatesInCommittee = 0;     // Length of above; should be *mostly* unused

var isPopupShown = true; // Quick start always is shown on load

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
    return id.replaceAll(" ", "").replaceAll("'", "").replaceAll(".", "").replaceAll("#", "").replaceAll("(non-voting)", "");
}

function getDelegatePresenseNodes() {
    return $("#normalDelegateList > div.delegatePresenseOuter").toArray().concat($("#customDelegateList > div.delegatePresenseOuter").toArray());
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
                $("#attendanceNode" + sanitizeForID(e.textContent)).css("display", "flex");

                listOfCountriesInCommittee.push($(e).children("div").children("p").clone().children().remove().end().text());
            } else {
                $("#attendanceNode" + sanitizeForID(e.textContent)).css("display", "none");
            }
        }
    });
}

var isNonVotingIncludedInDelegateCount = false;

function recalcDelegates() {
    refreshPresentDelegateList();

    var voters = getListOfVotingCountries().length;
    var numPresent = getListOfPresentCountries().length;

    $("#numberOfDelegates").text(numPresent + " Delegate" + (numPresent == 1 ? "" : "s"));
    $("#numberOfVotingMembers").text(voters + " Voting Member" + (voters == 1 ? "" : "s"));

    if(voters == numPresent) {
        $("#isNonVotingIncluded").css("display", "none");
        $("#numberOfVotingMembersContainer").css("display", "none");
    } else {
        $("#isNonVotingIncluded").css("display", "block");
        $("#numberOfVotingMembersContainer").css("display", "block");
    }

    if(isNonVotingIncludedInDelegateCount) {
        numPresent = voters;
        $("#nonVotingInEx").text("excluded");
    } else {
        $("#nonVotingInEx").text("included");
    }

    if(numPresent == 0) {
        document.getElementById("simpleMajorityLabel").textContent = "0/0";

        $("#newSpeakersList").prop("disabled", true);
        $("#newMod").prop("disabled", true);
        $("#newRoundRobin").prop("disabled", true);

        $("#simpleMajorityLabel").text("0/0");
        $("#twoThirdsLabel").text("0/0");
    } else {
        $("#newSpeakersList").prop("disabled", false);
        $("#newMod").prop("disabled", false);
        $("#newRoundRobin").prop("disabled", false);

        $("#simpleMajorityLabel").text(`${Math.ceil((numPresent+0.1)/2)}/${numPresent}`);
        $("#twoThirdsLabel").text(`${Math.ceil(numPresent*2/3)}/${numPresent}`);
    }

    if(voters == 0) {
        $("#commenceRollCall").prop("disabled", true);
    } else {
        $("#commenceRollCall").prop("disabled", false);
    }

    if(numDelegatesInCommittee == 0) {
        $("#takeAttendanceButton").prop("disabled", true);
    } else {
        $("#takeAttendanceButton").prop("disabled", false);
    }
}

function showPopup(elToShow = "", displayAttr = "block") {
    $("#crisisShownNotification").css("display", "none"); // fuck-ass soln, I don't care
    if(!isPopupShown) {
        document.getElementById("popupPage").childNodes.forEach(function(element) {
            if(typeof element.style != "undefined") {
                element.style.display = "none";
            }
        });

        $("#exitButtons").css("opacity", "1");

        if(elToShow) {
            $(elToShow).css("display", displayAttr);
        }

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
    if(isMirroring || isManuallySorting) return;
    var listedMotions = $("#motiondisplays > div").detach().toArray().sort(function(first, second) {
        if(motionTypeToImportance(first) > motionTypeToImportance(second)) {
            return -1;
        }
        return 1;
    });
    $.each(listedMotions, function(first, second) {
        $("#motiondisplays").append(second);
    });

    resendMirror();
}

var currentMotionId = 0;

function appendMotion(m) {
    if($("#firstMotionPrompt").length) $("#firstMotionPrompt").remove();

    if(isMirroring) {
        m.find("input").toArray().forEach((el) => {
            /* if(!$(el).attr("disabled")) */ if(!$(el).hasClass("customMotionNameInput")) $(el).replaceWith($("<span>").append(document.createTextNode(el.value)));
        });
        m.find("button").remove();
    } else {
        m.find("input").toArray().forEach(function(el) {
            $(el).on("change", resortMotions);
        });
    }

    m.attr("id", "");
    m.attr("data-motionid", currentMotionId++);

    if(!isMirroring) m.attr("data-rngid", Math.floor(Math.random()*10000).toString()); // Random id to add to keep track of motions that otherwise are identical, esp. for saving/restoring state

    m.appendTo("#motiondisplays");

    if(!isMirroring || true) {
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

        if(hasBasicFlag(v)) {
            cont.find("img").prop("src", `/flags/${basicListOfCountries[v]}.svg`);
            cont.find("img").css("display", "block");
        } else {
            cont.find("img").prop("src", `/favicon.png`);
            cont.find("img").css("display", "block");
        }

        let tp = $("<p>").text(v).addClass("attendanceText");
        tp.append($("<i>").text(" (non-voting)").css("display", dictOfDelegates()[v].canVote ? "none" : "inline"));
        $(cont.children("div").get(1)).prepend(tp);

        cont.attr("id", "attendanceNode" + sanitizeForID(v));
        cont.find("button").get(0).click();

        $("#attendanceListOfCountries").append(cont);
    });
}

function refreshAttendanceNodes() {
    let t = getAttendanceOfPresentCountries();
    $("#attendanceListOfCountries > *").remove();
    addAttendanceNodes();
    implementAttendanceList(t);
}

function implementAttendanceList(att) {
    $("#attendanceListOfCountries > *").css("display", "none");
    listOfCountriesInCommittee.forEach(function(el) {
        $("#attendanceNode" + sanitizeForID(el)).css("display", "flex");
    });
    Object.keys(att).forEach((country) => {
        var tan = $("#attendanceNode" + sanitizeForID(country));
        if(att[country] == "Pr") {
            tan.find("button").get(1).click();
        } else if(att[country] == "Pr&V") {
            tan.find("button").get(2).click();
        }
    });
}

function isTimeInvalid(s) {
    return !((!isNaN(s.replaceAll(":","").replaceAll(" ", ""))) && s != "")
}

function hidePopup(nextFunction = null) {
    if(window.location.href.includes("clock")) return;
    var quickStartKeyToGoOn = 0; /**
    * 0: Do nothing
    * 1: Delegate list done, now take attendance
    *       (This is a vestige of a past system. Pay it no mind.)
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
                createAlert("Delegate duration can't be zero");
                return;
            }
            if(Math.floor( stringToDuration($("#newModPopupDuration").val()) / stringToDuration($("#newModPopupDelegateDuration").val()) ) > getListOfPresentCountries().length) {
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
            if($("#speakersListNumDelegates").val() > getListOfPresentCountries().length) {
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
        } else if($("#attendanceList").css("display") != "none") {
            recalcDelegates();
        } else if($("#customMotionPopup").css("display") != "none") {
            if(isTimeInvalid($("#customMotionDuration").val())) {
                createAlert("Invalid duration");
                return;
            }
            if(stringToDuration($("#customMotionDuration").val()) <= 0) {
                createAlert("Duration can't be zero");
                return;
            }
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
        } else if($("#customMotionPopup").css("display") != "none") {
            var toAdd = $("#customMotionPrefab").clone(true);
            var inputList = toAdd.find("input");
            inputList[0].value = $("#customMotionName").val();
            inputList[1].value = $("#customMotionDuration").val();

            appendMotion(toAdd);
        }

        if(quickStartKeyToGoOn == 1) {
            nextFunction = function() {
                // showQuickStart();
                // $("#quickStartDelegates").prop("disabled", true);
                // $("#quickStartAttendance").prop("disabled", false);
                $("#takeAttendanceButton").click();
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
    } else {
        if(nextFunction) nextFunction();
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

    if(parentEl.getElementsByTagName("h1").length) {
        building["fancyMotionTitle"] = parentEl.getElementsByTagName("h1")[0].textContent;
    } else if(parentEl.getElementsByTagName("input").length) { // Only used for custom motions
        building["fancyMotionTitle"] = parentEl.getElementsByTagName("input")[0].value;
    }

    if(ty == "mod") {
        building["motionType"] = "mod";
        building["fancyMotionTitle"] = "Moderated Caucus";

        building["requiresDelegateList"] = true;
        building["timerType"] = "perDelegate";

        var inputs = parentEl.getElementsByTagName(elementNameToGet);
        building["motionTopic"] = inputs[0][propertyToGet];
        building["duration"] = stringToDuration(inputs[1][propertyToGet]);
        building["delegateDuration"] = stringToDuration(inputs[2][propertyToGet]);

        inputs[0]
    } else if(ty == "unmod") {
        building["motionType"] = "unmod";
        building["fancyMotionTitle"] = "Unmoderated Caucus";

        building["requiresDelegateList"] = false;
        building["timerType"] = "one";

        var inputs = parentEl.getElementsByTagName(elementNameToGet);
        building["motionTopic"] = inputs[0][propertyToGet];
        building["duration"] = stringToDuration(inputs[1][propertyToGet]);
    } else if(ty == "speakersList") {
        building["motionType"] = "speakersList";
        building["fancyMotionTitle"] = "Speakers List";

        building["motionTopic"] = "";

        building["requiresDelegateList"] = true;
        building["timerType"] = "perDelegate";

        var inputs = parentEl.getElementsByTagName(elementNameToGet);
        building["duration"] = Number(inputs[0][propertyToGet]) * stringToDuration(inputs[1][propertyToGet]);
        building["delegateDuration"] = stringToDuration(inputs[1][propertyToGet]);
    } else if(ty == "roundRobin") {
        building["motionType"] = "roundRobin";
        building["fancyMotionTitle"] = "Round Robin";

        building["requiresDelegateList"] = false;
        building["timerType"] = "perDelegate";

        var inputs = parentEl.getElementsByTagName(elementNameToGet);
        building["duration"] = getListOfPresentCountries().length * stringToDuration(inputs[1][propertyToGet]);
        building["delegateDuration"] = stringToDuration(inputs[1][propertyToGet]);
        building["motionTopic"] = inputs[0][propertyToGet];
    } else if(ty == "custom") {
        var inputs = parentEl.getElementsByTagName(elementNameToGet);

        building["motionType"] = "custom";
        building["fancyMotionTitle"] = inputs[0].value;

        building["requiresDelegateList"] = false;
        building["timerType"] = "one";

        building["motionTopic"] = "";
        building["duration"] = stringToDuration(inputs[1][propertyToGet]);
    }

    return building;
}

function passMotion(parentEl) {
    parsePassedMotionJSON(constructJSON(parentEl));
}

function parsePassedMotionJSON(details) {
    if(isMirroring && currentMotion == null) {
        $("#rightbottomarea").animate({
            "opacity" : "1"
        }, 150);
    }

    currentMotion = details;

    if(details["requiresDelegateList"]) {
        $("#passedMotionCountryChooser").css("display", "flex");
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

    $("#modDelegateIndexSpan").text("1");
    $("#numberOfAddedCountriesSpan").text("0");

    if(details["timerType"] == "one") {
        document.getElementById("oneLargeTimerContainer").style.display = "block";
        largeTimerCurrentTime = details["duration"];
        largeTimerOriginalDuration = details["duration"];

        $("#yieldTimeButton").css("display", "none");
        $("#previousSpeakerButton").css("display", "none");
        $("#numberOfAddedCountriesLabel").css("display", "none");

        $(".hiddenOnModStart").css("display", "none");
    } else if(details["timerType"] == "perDelegate") {
        document.getElementById("oneLargeTimerContainer").style.display = "block";
        largeTimerCurrentTime = details["delegateDuration"];
        largeTimerOriginalDuration = details["delegateDuration"];
        largeTimerNumDelegates = Math.floor(details["duration"] / details["delegateDuration"] + 0.03);

        perDelegateCurrentPosition = 0;
        
        $("#modPlacementP").css("display", "block");
        $("#modDelegateTotal").text(largeTimerNumDelegates.toString());
        $("#maxNumberOfAddedCountriesSpan").text(largeTimerNumDelegates);

        $("#yieldTimeButton").css("display", "inline");
        $("#previousSpeakerButton").css("display", "inline");

        $(".hiddenOnModStart").css("display", "block");

        canSortChosenCountries = true;
    } else if(details["timerType"] == "none") {
        $("#oneLargeTimerContainer").css("display", "none");
    }

    $("#passedMotionListSearch").val("");

    $("#chosenCountriesForTimer").sortable({
        animation : 150,
        onStart : function(evt) {
            stopTimer();
        },
        onEnd : function(evt) {
            refreshModChosenCountriesIds();
            if(evt.oldIndex == perDelegateCurrentPosition) {
                perDelegateCurrentPosition = evt.newIndex;
            } else if(evt.oldIndex > perDelegateCurrentPosition && evt.newIndex <= perDelegateCurrentPosition) {
                perDelegateCurrentPosition++;
            } else if(evt.oldIndex < perDelegateCurrentPosition && evt.newIndex >= perDelegateCurrentPosition) {
                perDelegateCurrentPosition--;
            }
            stopTimer();
            resendMirror();
            //refreshModCurrentCountryNumberBackground();
        }
    });

    if(details["requiresDelegateList"]) {
        $("#actualPassedMotionCountryChooser").children().remove();
        $("#chosenCountriesForTimer").children().remove();

        $("#chosenCountriesForTimer").css("display", "");

        var i = 0;

        $("#chosenCountriesForTimer > *").remove();
        getListOfPresentCountries().forEach(function(val) {
            var toAdd = $(`<button class="outlineddiv marginizechildren countryListOne${isMirroring ? " noHoverEffect" : ""}"></button>`);

            toAdd.css("padding", "15px");
            toAdd.css("display", "flex");
            toAdd.css("width", "100%");

            toAdd.attr("id", "modCaucusCountryChooser" + sanitizeForID(val));
            toAdd.attr("data-countrynum", i++);
            toAdd.attr("data-initialheight", toAdd.height());

            if(hasBasicFlag(val)) {
                toAdd.append(
                    $("<img>").prop("src", `/flags/${basicListOfCountries[val]}.svg`).addClass("countryFlag")
                );
            } else {
                toAdd.append(
                    $("<img>").prop("src", `/favicon.png`).addClass("countryFlag")
                );
            }

            toAdd.append($("<p>").text(val));

            toAdd.on("click", modCountryChooserClickEventFunctionResponder);

            if(details.chosenCountries && details.chosenCountries.includes(val)){
                toAdd.appendTo($("#chosenCountriesForTimer"));
            } else {
                toAdd.appendTo($("#actualPassedMotionCountryChooser"));
            }
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

        if(!isMirroring) {
            $("#rightbottomarea").css("display", "");
            $("#rightbottomarea").css("opacity", "0");

            $("#rightbottomarea").animate({
                opacity : 1
            }, 150);
        } else {
            $("#rightbottomarea").css("display", "");
            $("#rightbottomarea").css("opacity", "1");
        }

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
    "fancyMotionTitle":     "Introduce Papers",
    "requiresDelegateList":  false,
    "timerType":            "none",
    "motionTopic":          ""
};

const votingProcedureJSONConfig = {
    "motionType":           "presentPapers",
    "fancyMotionTitle":     "Voting Procedure",
    "requiresDelegateList":  false,
    "timerType":            "none",
    "motionTopic":          ""
};

function getPassedMotionElements() {
    return $("#actualPassedMotionCountryChooser").children().toArray();
}

function refreshSearch(_e_ = null, delay = 0, getNodeFunction = getDelegatePresenseNodes, requiredClass = "delegatePresenseOuter", currentSearchVal = $("#delegateListSearch").val()) { // The second parameter is vestigial. The first can be ignored. I am good at coding.
    var t = currentSearchVal.toLowerCase();
    getNodeFunction().forEach((ee) => { // Variable naming is my passion
        let e = $(ee);
        if(!e.hasClass(requiredClass)) return;
        if(e.attr("data-can-be-shown") == false || e.attr("data-can-be-shown") == "false") return;
        //console.log(e.text());
        if(e.text().toLowerCase().includes(t)) {
            e.css("display", "");
        } else {
            e.css("display", "none");
        }
    });
}

document.getElementById("delegateListSearch").oninput = refreshSearch;
document.getElementById("passedMotionListSearch").oninput = function() {
    refreshSearch(
        null,
        0,
        getPassedMotionElements,
        "countryListOne",
        $("#passedMotionListSearch").val()
    );
}

var keyboardTimeout;

document.onkeydown = function(event) {
    if(isMirroring) return;

    if(event.key == "Control" && !isPopupShown) {
        clearInterval(keyboardTimeout);
        keyboardTimeout = setTimeout(() => {
            if(event.key == "Control") {
                $("*:enabled > .keyboardShortcut").css("display", "initial");
            }
        }, 300);
    }

    if(!isPopupShown) {

        if(event.ctrlKey && currentMotion == null && document.activeElement.nodeName != "INPUT") {
            if(event.key == "m") {
                document.getElementById("newMod").click();
                return false;
            }
            if(event.key == "u") {
                document.getElementById("newUnmod").click();
                return false;
            }
            if(event.key == "s") {
                document.getElementById("newSpeakersList").click();
                return false;
            }
            if(event.key == "r") {
                document.getElementById("newRoundRobin").click();
                return false;
            }
            if(event.key == "i") {
                document.getElementById("newRoundRobin").click();
                return false;
            }

            if(event.key == "d") {
                document.getElementById("editdelegatelistbutton").click();
                return false;
            }
            if(event.key == "a") {
                document.getElementById("takeAttendanceButton").click();
                return false;
            }

            if(event.key == "t") {
                document.getElementById("impromptuTimerButton").click();
                return false;
            }
            if(event.key == "v") {
                document.getElementById("commenceRollCall").click();
                return false;
            }
        }

        if(event.key == "Enter") {
            if(document.activeElement == $("#passedMotionListSearch")[0]) {
                var shownElement = undefined;
                var numfound = 0;
                $($("#actualPassedMotionCountryChooser").children("button").get().reverse()).each(function(el) {
                    if($(this).css("display") == "flex") {
                        shownElement = $(this);
                        numfound++;
                    }
                });
                
                //console.log(numfound);

                if(shownElement != undefined && shownElement != null && numfound == 1) {
                    shownElement.click();
                    $("#clearPassedMotionSearch").click();
                }
            } else if(document.activeElement == $("#oneLargeTimer")[0]) {
                $("#oneLargeTimer").blur();
            }
        }

        if(event.key == "Escape") $("#alertContainer").css("display", "none");

    } else if(isPopupShown) {
        if(event.key == "Enter") {
            if($("#editDelegateList").css("display") != "none") {
                if(document.activeElement == $("#delegateListSearch")[0]) {
                    getDelegatePresenseNodes().some(function(el) {
                        if($(el).css("display") != "none") {
                            $(el).children(".countryListInner").click();
                            $("#clearDelegateListSearch").click();
                            return true;
                        }
                        return false;
                    });
                } else if(document.activeElement == $("#newDelegateInput")[0]) {
                    $("#newDelegateSubmit").click();
                    $("#newDelegateInput").focus();
                }
            } else if($("#impromptuTimer").css("display") == "none" && $("#quickStartPopup").css("display") == "none") {
                $("#exitPopup").click();
            }
        }
    }
    if(document.activeElement.nodeName != "INPUT") {
        if(event.key == " ") {
            if($("#impromptuTimer").css("display") != "none") {
                $("#impromptuTimerStartStop").click();
            } else {
                toggleTimer();
            }
        }
    }
    if(event.key == "Escape") {
        if(!isInQuickStart) if(document.getElementById("quitPopup").style.display == "none") hidePopup();
        else quitPopup();
    }
};

document.onkeyup = function(event) {
    if(event.key == "Control") {
        clearInterval(keyboardTimeout);
        $(".keyboardShortcut").css("display", "none");
    }
}

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
    if(isMirroring) return;

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
    if(!currentMotion) return false;
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
            largeTimerCurrentTime = largeTimerOriginalDuration;
            perDelegateCurrentPosition = largeTimerNumDelegates-1;
            refreshTimer();
        }
    }

    perDelegateCurrentPosition = Math.min(perDelegateCurrentPosition, largeTimerNumDelegates-1);

    refreshModCurrentCountryNumberBackground();

    refreshTimer(false);
    resendMirror();
}

function refreshTimer(e=true) {
    if(e) {
        if(isLargeTimerGoing && document.getElementById("oneLargeTimerContainer").style.display != "none" && document.getElementById("rightbottomarea").style.display != "none") {
            largeTimerCurrentTime--;
            if(largeTimerCurrentTime <= 0) {
                largeTimerCurrentTime = 0;
    
                if(perDelegateCurrentPosition+1 != largeTimerNumDelegates) {
                    moveToNextDelegate();
                } else {
                    stopTimer();
                }
            }
            resendMirror();
        }
    }

    if(document.activeElement != $("#oneLargeTimer")[0]) $("#oneLargeTimer").val(timeToString(largeTimerCurrentTime));

    //$("#chosenCountriesForTimer").children().css("background-color", "");
    //if(!canSortChosenCountries) 
    //$($("#chosenCountriesForTimer").children()[perDelegateCurrentPosition]).css("background-color", "powderblue");

    $("#modDelegateIndexSpan").text(perDelegateCurrentPosition+1);
}

function endCurrentMotion() {
    stopTimer();

    $("#rightbottomarea").animate({
        opacity: 0
    }, 150);

    $("#leftbottomarea").css("opacity", "0");
    $("#leftbottomarea").css("display", "");
    $("#leftbottomarea").animate({
        opacity : 1
    }, 150);

    setTimeout(function(_e) {
        $("#rightbottomarea").css("display", "none");
        $("#rightbottomarea").css("opacity", "1");

        resendMirror();
    }, 250);

    $("#exitCurrentMotion").css("display", "none");
    $("#newmotions").css("display", "block");

    currentMotion = null;

    document.getElementById("motiondisplays").childNodes.forEach((el) => {
        el.remove();
    });

    $("#actualPassedMotionCountryChooser > *").remove();
}

function createDelegatePresenseNode(name, clicked=false) {
    var outer = $("<div>");
    outer.addClass("delegatePresenseOuter");

    var cb = $("<div>");
    cb.attr("data-isclicked", "false");
    cb.addClass("countryListInner");

    if(hasBasicFlag(name)) {
        cb.append(
            $("<img>").prop("src", `/flags/${basicListOfCountries[name]}.svg`).addClass("countryFlag")
        );
    } else {
        cb.append(
            $("<img>").prop("src", `/favicon.png`).addClass("countryFlag")
        );
    }

    var tp = $("<p>").css("display", "table-cell").text(  name  ).css("vertical-align", "middle").css("line-height", "45px").width("100%").addClass("presenseP");
    tp.append($("<i>").text(" (non-voting)").css("display", dictOfDelegates()[name].canVote ? "none" : "inline"));
    cb.append(tp);

    cb.css("margin", "0");
    cb.on("click", changeClickedEventResponder);

    //if(!basicListOfCountries[name]) {
    if(true) {
        let tb = $("<button>").text("Voting").css("display", "inline").addClass("presenceButton").on("click", function(_e) { // Holy spaghetti
            _e.stopPropagation();
            if($(this).text() == "Voting") {
                $(this).text("Non-Voting");
                $(this).parent().find("i").css("display", "inline");
                
                if(isBasicMember(name)) {
                    dictOfBasicDelegates[$(this).parent().clone().find("i").remove().end().find("p").text()].canVote = false;
                } else {
                    dictOfCustomDelegates[$(this).parent().clone().find("i").remove().end().find("p").text()].canVote = false;
                }
            } else if($(this).text() == "Non-Voting") {
                $(this).text("Voting");
                $(this).parent().find("i").css("display", "none");

                if(isBasicMember(name)) {
                    dictOfBasicDelegates[$(this).parent().clone().find("i").remove().end().find("p").text()].canVote = true;
                } else {
                    dictOfCustomDelegates[$(this).parent().clone().find("i").remove().end().find("p").text()].canVote = true;
                }
            }
        });
        cb.append(tb);
        if(nonVotingBasicMembers.includes(name)) tb.click();
    }

    outer.append(cb);
    //outer.append($("<br>"));
    outer.append( $("#dividerLinePrefab").clone(true).attr("id", "").css("display", "block").css("margin", "5px 0 5px 25%") );

    if(clicked) { // Lazy-ass coding
        cb.click();
    }

    return outer;
}

function setCurrentCountryList(newList, isFirstTime = false) {
    let countriesAlreadyDone = []; // Prevent doubling countries, esp. custom ones

    getDelegatePresenseNodes().forEach((el) => {
        $(el).remove();
    });
    $("#customDelegateList > *:not(h2):not(button):not(.dontDeleteMe)").remove();

    $("#normalDelegateList").append( $("#dividerLinePrefab").clone(true).attr("id", "").css("display", "block").css("margin", "5px 0 5px 25%") );
    $("#customDelegateList").append( $("#dividerLinePrefab").clone(true).attr("id", "").css("display", "block").css("margin", "5px 0 5px 25%") );

    getListOfCountries().forEach(function(v) {
        if(countriesAlreadyDone.includes(v)) {
            return;
        } else {
            countriesAlreadyDone.push(v);
        }
        
        var tempNode = createDelegatePresenseNode(v, newList.includes(v));

        if(isBasicMember(v)) {
            $("#normalDelegateList").append(tempNode);
        } else {
            if(!isFirstTime) $("#customDelegateList").append(tempNode);
        }
    });
}

function setCustomDelegates(newCustomDelegates) {
    if(newCustomDelegates == undefined) newCustomDelegates = {};
    dictOfCustomDelegates = newCustomDelegates;
}

function refreshModCountryList() {
    $("#numberOfAddedCountriesSpan").text($("#chosenCountriesForTimer").children().length);
}

function refreshModCurrentCountryNumberBackground() {
    if(currentMotion["timerType"] == "perDelegate") {
        $("#chosenCountriesForTimer").children().css("background-color", "");
        $($("#chosenCountriesForTimer").children()[perDelegateCurrentPosition]).css("background-color", "powderblue");

        //$("#chosenCountriesForTimer").sortable("destroy");
        //canSortChosenCountries = false;

        //$(".hiddenOnModStart").css("display", "none");

        // $("#actualPassedMotionCountryChooser > *").off("click");
        // $("#passedMotionCountryChooser").animate({
        //     "width" : 0,
        //     "margin-right" : 0,
        //     "margin-left" : 0,
        //     "padding-right" : 0,
        //     "padding-left" : 0,
        // }, 150, () => {
        //     $("#passedMotionCountryChooser").css("display", "none");
        //     $("#passedMotionCountryChooser").css("width", "");
        //     $("#passedMotionCountryChooser").css("margin-right", "");
        //     $("#passedMotionCountryChooser").css("margin-left", "");
        //     $("#passedMotionCountryChooser").css("padding-left", "");
        //     $("#passedMotionCountryChooser").css("padding-right", "");
        // });
    }
}

function refreshModChosenCountriesIds() {
    var index = 0;
    $("#chosenCountriesForTimer").children().each(function(_el) {
        $(this).children("p.modIdP").text(++index);
    });
}

function modCountryChooserClickEventFunctionResponder() {
    if($("#chosenCountriesForTimer").children().length >= largeTimerNumDelegates) {
        createAlert("Queue is already filled");
        return;
    }

    for(let child in $("#chosenCountriesForTimer").children().toArray()) {
        var tt = $($("#chosenCountriesForTimer").children().toArray()[child]).children("p")[0].textContent;
        if(tt == $(this).text()) {
            return;
        }
    }
    
    var toAdd = $(`<button class="outlineddiv marginizechildren countryListOne"></button>`).css("padding", "15px").css("width", "100%").on("click", function() {
        if(isMirroring) return;
        if(canSortChosenCountries && false) {
            $("#modCaucusCountryChooser" + sanitizeForID($(this).children(".expandToFlexWidth").text())).css("display", "flex").animate({
                "padding" : "15px",
                "margin-bottom" : "10px"
            }, 150).attr("data-can-be-shown", true);

            $(this).off("click");

            $(this).animate({
                "height" : 0,
                "padding-top" : 0,
                "padding-bottom" : 0
            }, 150, () => {
                this.remove();
                refreshModChosenCountriesIds();
            });

            refreshModCountryList();
            resendMirror();
        } else {
            largeTimerCurrentTime = largeTimerOriginalDuration;
            var i = 0;

            for(let child in $("#chosenCountriesForTimer").children().toArray()) {
                var tt = $($("#chosenCountriesForTimer").find("p:not(.modIdP):not(button)").toArray()[child]).text(); // Enough to make a grown man cry (eh it was worse before)
                
                if(tt == $(this).find(":not(.modIdP):not(button)").text()) {
                    perDelegateCurrentPosition = i;
                    break;
                }
                i++;
            }
            stopTimer();
            refreshTimer();
            refreshModCurrentCountryNumberBackground();
        }
    });

    toAdd.append($("<p>").addClass("modIdP").text("Id here"));

    if(hasBasicFlag(this.textContent)) {
        toAdd.append(
            $("<img>").prop("src", `/flags/${basicListOfCountries[this.textContent]}.svg`).addClass("countryFlag")
        );
    } else {
        toAdd.append(
            $("<img>").prop("src", `/favicon.png`).addClass("countryFlag")
        );
    }

    toAdd.append($("<p>").text(this.textContent).addClass("expandToFlexWidth"));
    
    if(!isMirroring) {
        toAdd.append($("<button>").text("X").addClass("modIdButton").on("click", function(_e) {
            $("#modCaucusCountryChooser" + sanitizeForID($(this).parent().children(".expandToFlexWidth").text())).css("display", "flex").animate({
                "padding" : "15px",
                "margin-bottom" : "10px"
            }, 150).attr("data-can-be-shown", true);
    
            $(this).parent().off("click");
            $(this).off("click");
    
            $(this).parent().animate({
                "height" : 0,
                "padding-top" : 0,
                "padding-bottom" : 0
            }, 150, () => {
                $(this).parent().remove();
                refreshModChosenCountriesIds();
                refreshModCurrentCountryNumberBackground();
            });
    
            let tId = 0; // Index of element being deleted
            for(let child in $("#chosenCountriesForTimer").children().toArray()) {
                var tt = $($("#chosenCountriesForTimer").find("p:not(.modIdP):not(button)").toArray()[child]).text(); // Enough to make a grown man cry (eh it was worse before)
                
                if(tt == $(this).parent().find(":not(.modIdP):not(button)").text()) {
                    break;
                }
                tId++;
            }
    
            if(perDelegateCurrentPosition > tId) {
                perDelegateCurrentPosition--;
            }
    
            refreshModCountryList();
            resendMirror();
        }));
    }
    
    toAdd.appendTo($("#chosenCountriesForTimer"));

    refreshModChosenCountriesIds();

    $(this).animate({
        "height" : 0,
        "padding-top" : 0,
        "padding-bottom" : 0,
        "margin-bottom" : 0
    }, 150, () => {
        $(this).css("display", "none");
        $(this).css("height", "");
    });

    $(this).attr("data-can-be-shown", false);

    refreshModCountryList();
    resendMirror();
}

function motionTypeToImportance(el) {
    var n = el.getAttribute("data-motiontype");
    let ell = $(el);
    if(n == "custom") return 120;
    if(n == "presentPapers") return 100 - Number( ell.attr("data-motionid") );
    if(n == "setAgenda")     return 70 - Number( ell.attr("data-motionid") );
    if(n == "speakersList")  return 50 + Number( el.getElementsByTagName("input")[0].value ) / 1000 - Number( ell.attr("data-motionid") );
    if(n == "unmod")         return 40 + stringToDuration( el.getElementsByTagName("input")[1].value ) / 1000 - Number( ell.attr("data-motionid") );
    if(n == "roundRobin")    return 20 + stringToDuration( el.getElementsByTagName("input")[1].value ) / 1000 - Number( ell.attr("data-motionid") );
    if(n == "mod")           return 0 + stringToDuration( el.getElementsByTagName("input")[1].value ) / 1000 - Number( ell.attr("data-motionid") );
    return -100000; // :)
}

function showQuickStart() {
    showPopup("#quickStartPopup");
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
var isManuallySorting = false;

window.onload = function(_event) {
    if(window.location.href.includes("mobile")) { // Do mobile setup things
        $("head").append($("<link>").attr("rel", "stylesheet").attr("href", "/mobile-style.css"));

        $("#quickStartPopup").removeClass("largePopup");

        createAlert("This website is NOT meant to be used on a mobile device! It is meant to be on a large screen up at the front of the conference. But you do you, I guess.")
    }

    Object.keys(basicListOfCountries).forEach((el) => {
        dictOfBasicDelegates[el] = {canVote : !nonVotingBasicMembers.includes(el), isoCode : basicListOfCountries[el]}
    });

    $("#popupPage").children("div").each(function(_el) {
        if($(this).attr("id") != "exitButtons" && $(this).attr("id") != "quickStartPopup") $(this).css("display", "none");
    });

    if(window.location.href.includes("mirror") || window.location.href.includes("clock")) { // Do mirror setup things
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
        $("#quickStartPopup").remove();
        $(".deleteOnMirror").remove();

        $("input:not(.enableInputMirror)").attr("disabled", true);

        $("#floatBottomRight").css("display", "none");

        $("#impromptuTimerLabel").replaceWith($("<p>").prop("id", "impromptuTimerLabel").text("5:00"));

        $("#committeeName").remove();
        $("#committeeNameContainer").append(
            $("<h1>").prop("id", "committeeName").css("background-color", "rgb(0, 0, 0, 0)")
        );

        $("#changeMirrorButton").css("display", "block");
        $("#changeMirrorButton").on("click", function() {
            chosenMirrorableSalt = null;
            hasChoosenMirrorable = false;
            seenStates = {};

            implementStateJSON(JSON.parse(NothingSaveFile));
            showPopup("#mirrorSetupPopup");
            $("#listOfMirrorables").children().remove();

            ws.send(JSON.stringify({
                name       : jccData.name,
                salt       : jccData.salt,
                type       : "requestMirrors"
            }));
        })

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

        if(window.location.href.includes("clock")) {
            $("#setupMirroringH1").text("Setup a clock")
        }
    }

    wsUrl = window.location.toString().includes("localhost") ? "ws://localhost:3011/rss" : "wss://" + window.location.host + "/rss";

    $("#committeeName").val("");
    $("#committeeName").text("[No name]");
    $("#newDelegateInput").val("");

    addAttendanceNodes();

    document.getElementById("rightbottomarea").style.display = "none";

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
                resendMirror();
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
            //if(!isTimerHalted && !canSortChosenCountries && perDelegateCurrentPosition <= largeTimerNumDelegates-1) {
            if(!isTimerHalted && canSortChosenCountries && perDelegateCurrentPosition <= largeTimerNumDelegates-1) {
                moveToNextDelegate();
            }
        });
    
        $("#saveToCloudButton").on("click", function(_e) {
            if(!window.navigator.onLine) {
                createAlert("You must be connected to the internet");
                return;
            }
            showPopup("#saveToTheCloudPopup");
            $("#exitPopup").css("display", "none");
            $("#saveToCloudName").val("");
            $("#saveLoadInput").val("");
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
            showPopup("#loadFromTheCloudPopup");
            $("#exitPopup").css("display", "none");
            $("#loadFromCloudName").val("");
        });
    
        $("#loadFromCloudSubmit").on("click", function(_e) {
            if($("#saveToCloudName").val().length <= 0) {
                createAlert("Name cannot be empty");
                return;
            }
            var d = {
                id   : $("#saveToCloudName").val()
            };
            console.log(d);
            $.ajax({
                type    : "POST",
                url     : "/getsavedata",
                contentType: 'application/json',
                success : function(returned) {
                    console.log(returned);
                    implementStateJSON(returned);
                },
                error   : function(returned) {
                    createAlert(returned);
                    console.log(returned);
                },
                data    : JSON.stringify(d)
            });
            quitPopup();
        });
    
        $("#newDelegateSubmit").on("click", function(_e) {
            if($("#newDelegateInput").val() == "") return;

            if(dictOfCustomDelegates[$("#newDelegateInput").val()]) {
                createAlert("That custom delegate already exists!");
                return;
            }
    
            //customDelegates.push($("#newDelegateInput").val());
            dictOfCustomDelegates[$("#newDelegateInput").val()] = {canVote : true};
            
            $("#customDelegateList").append(createDelegatePresenseNode($("#newDelegateInput").val(), true));
    
            $("#newDelegateInput").val("");
    
            hasMadeNewDelegate = true;
    
            refreshSearch();
        });

        $("#massImportDelegates").on("click", function() {
            hidePopup(function() {
                showPopup("#massImportDelegatesPopup");
                $("#massImportDelegatesArea").val("");
            });
        });

        $("#massImportDelegatesSubmit").on("click", function() {
            $("#massImportDelegatesArea").val().split("\n").forEach((el) => {
                if(el.trim()) {
                    $("#newDelegateInput").val(el);
                    $("#newDelegateSubmit").click();
                }
            });
            $("#massImportDelegatesArea").val("");
            alert("Imported.");
            hidePopup(function() {
                showPopup("#editDelegateList");
            });
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

        $("#oneLargeTimer").on("focus", function(_e) {
            stopTimer();
        });
        $("#oneLargeTimer").on("blur", function(_e) {
            if(isTimeInvalid($("#oneLargeTimer").val()) || (currentMotion.type == "mod" && stringToDuration($("#oneLargeTimer").val()) > largeTimerOriginalDuration)) {
                $("#oneLargeTimer").val(durationToString(largeTimerOriginalDuration));
            }
            largeTimerCurrentTime = stringToDuration($("#oneLargeTimer").val());
            refreshTimer();
        });
        
        $("#allAbsentButton").on("mousedown", function(_e) {
            Array(...document.getElementById('attendanceListOfCountries').children).forEach((el) => {
                if($(el).css("display") != "none") {
                    $(el).find("button")[0].click();
                }
            });
        });
        $("#allPresentButton").on("mousedown", function(_e) {
            Array(...document.getElementById('attendanceListOfCountries').children).forEach((el) => {
                if($(el).css("display") != "none") {
                    $(el).find("button")[1].click();
                }
            });
        });
        $("#allPrVButton").on("mousedown", function(_e) {
            Array(...document.getElementById('attendanceListOfCountries').children).forEach((el) => {
                if($(el).css("display") != "none") {
                    $(el).find("button")[2].click();
                }
            });
        });
    
        $("#startJCC").on("click", function(_e) {
            showPopup("#joinJccPopup");
        });
        $("#jccInfo").on("click", function(_e) {
            showPopup("#jccInfoPopup");
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
        $("#jccSendCrisisButton").on("click", function(_e) {
            if(ws == undefined) return;
            var d = {
                name  : jccData.name,
                salt  : jccData.salt,
                type  : "crisis",
                messageBody : $("#jccSendCrisisInput").val(),
                sender     : $("#committeeName").val(),
                sound : $("#crisisSoundChoice").val()
            };
            ws.send(JSON.stringify(d));
            $("#jccSendCrisisInput").val("");
            $("#crisisShownNotification").css("display", "block");
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
            if(getListOfPresentCountries().length <= 0) {
                createAlert('You have not taken attendance', (_e) => {
                    $("#takeAttendanceButton").click()
                });
                return;
            }
            showPopup("#newModPopup");
            $("#newModTopic").val("");
            $("#newModPopupDuration").val("5:00");
            $("#newModPopupDelegateDuration").val("1:00");
        
            $("#newModTopic").focus()
        });
        
        document.getElementById("newSpeakersList").onclick = function(_event) {
            if(numDelegatesInCommittee == 0) {
                createAlert('You have not chosen any delegates to be in committee. Click "Edit List" to do so.', (_e) => {
                    $("#editdelegatelistbutton").click()
                });
                return;
            }
            if(getListOfPresentCountries().length <= 0) {
                createAlert('You have not taken attendance', (_e) => {
                    $("#takeAttendanceButton").click()
                });
                return;
            }
            showPopup("#speakersListPopup");
            $("#speakersListNumDelegates").val("10");
            $("#speakersListPopupDelegateDuration").val("1:00");
        
            $("#speakersListNumDelegates").focus()
        }
        
        document.getElementById("newUnmod").onclick = function(_event) {
            showPopup("#newUnmodPopup");
            $("#newUnmodTopic").val("");
            $("#newUnmodPopupDuration").val("5:00");
        
            $("#newUnmodTopic").focus()
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
            if(getListOfPresentCountries().length <= 0) {
                createAlert('You have not taken attendance', (_e) => {
                    $("#takeAttendanceButton").click()
                });
                return;
            }
            showPopup("#roundRobinPopup");
            $("roundRobinTopic").val("");
            $("#roundRobinDelegateDuration").val("0:15");
        
            $("roundRobinTopic").focus();
        }

        $("#newCustom").on("click", function(_event) {
            showPopup("#customMotionPopup");
            $("#customMotionName").val("");
            $("#customMotionDuration").val("2:00");
        
            $("#customMotionName").focus()
        });
        
        document.getElementById("editdelegatelistbutton").onclick = function(_event) {
            showPopup("#editDelegateList", "flex");
            $("#delegateListSearch").focus();
            $("delegateListSearch").val("");
            refreshSearch();
            $("#quitPopup").css("display", "none");
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
                showPopup("#attendanceList", "flex");
                $("#quitPopup").css("display", "none");
            }
        };

        $("#enableMotionSorting").on("click", function(_e) {
            $("#motiondisplays").sortable({
                animation : 150,
                change    : resendMirror
            });

            $("#enableManualSorting").css("display", "none");
            $("#disableManualSorting").css("display", "block");

            isManuallySorting = true;
        });

        $("#disableMotionSorting").on("click", function(_e) {
            $("#motiondisplays").sortable("destroy");

            $("#enableManualSorting").css("display", "block");
            $("#disableManualSorting").css("display", "none");

            isManuallySorting = true;

            resortMotions();
        });

        $("#loadPreset").on("click", function(_e) {
            if($("#presetSelect").val() == "General Assembly") {
                quitPopup(() => $("#takeAttendanceButton").click());
                //implementStateJSON(JSON.parse(GeneralAssemblyLoadString));
                $("#normalDelegateList > *").children("div.countryListInner").toArray().forEach((el) => {
                    if($(el).attr("data-isclicked") == "false") $(el).click();
                });
                recalcDelegates();
                
                refreshAttendanceNodes();
            } else if($("#presetSelect").val() == "Security Council") {
                quitPopup(() => $("#takeAttendanceButton").click());
                implementStateJSON(JSON.parse(SecurityCouncilLoadString));
            } else if($("#presetSelect").val() == "G20") {
                quitPopup(() => $("#takeAttendanceButton").click());
                implementStateJSON(JSON.parse(G20LoadString));
            } else if($("#presetSelect").val() == "European Union") {
                quitPopup(() => $("#takeAttendanceButton").click());
                implementStateJSON(JSON.parse(EuropeanUnionLoadString));
            } else if($("#presetSelect").val() == "ASEAN") {
                quitPopup(() => $("#takeAttendanceButton").click());
                implementStateJSON(JSON.parse(ASEANLoadString));
            }
            $("#firstMotionPrompt").css("display", "block");
        });

        $("#quickStartDelegates").on("click", function(_e) {
            hidePopup(function() {
                isInQuickStart = true;
                $('#editdelegatelistbutton').click();
                $('#quickStartAttendance').prop('disabled', false);
                $('#quickStartSplitLeft').remove();
            });
        });

        $("#hideLeftAttendancePanel").on("click", function(_el) {
            if($("#bigAttendance").css("display") == "none") {
                $("#bigAttendance").css("display", "block");
                $(this).text("Hide left panel");
            } else {
                $("#bigAttendance").css("display", "none");
                $(this).text("Show left panel");
            }
        });

        $("#isNonVotingIncluded").on("click", function(_el) {
            isNonVotingIncludedInDelegateCount = !isNonVotingIncludedInDelegateCount;
            recalcDelegates();
        });

        $("#popupPage").on("click", function(_e) {
            if(isPopupShown && _e.target == this) {
                if($("#quitPopup").css("display") != "none") {
                    $("#quitPopup").click();
                } else if($("#exitPopup").css("display") != "none") {
                    $("#exitPopup").click();
                }
            }
        });

        $("button").on("click", function(_e) {
            $(":focus").blur();
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
                $("#impromptuTimerLabel").text(durationToString(impromptuTime));

                resendMirror();
            }
        }, 1000);

        $("#committeeName").on("change", function(_e) {
            $(document).prop("title", `${$("#committeeName").val()}${$("#committeeName").val().length ? " - " : ""}Model UN`)
            resendMirror();
        });
    }

    $("#impromptuTimerButton").on("click", function(_e) {
        if(isPopupShown) return;
        showPopup("#impromptuTimer");
        $("#exitPopup").css("display", "none");
        $("#quitPopup").text("Close");

        resendMirror();
    });

    $("#commenceRollCall").on("click", function(_e) {
        let votingCountries = getListOfVotingCountries(); // Reduce calls to this or smth

        if(votingCountries.length <= 0) {
            createAlert("Take attendance before taking a roll call vote!", function() {
                $("#takeAttendanceButton").click();
            });
            return;
        }
        $("#rollCallButtonContainer > *").prop("disabled", false);
        
        numPossibleVoters = votingCountries.length;
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
        votingCountries.forEach(function(el) {
            $("#rollCallPastChoices").append(
                $("<div>").attr("data-num", ttt++).attr("data-bg-color", "#ffffff").append($(`<p class="expandAllTheWay">${el}</p>`)).append($(`<p class="expandAllTheWay entireLineHeight colorMePlease">No Vote</p>`)).on("click", function(_e) {
                    rollCallCurrentVoter = $(this).attr("data-num");
                    goToNextRollCallVote(false);
                })
            )
        });

        showPopup("#rollCallVotePopup");
        $("#quitPopup").text("Close");
        $("#exitPopup").css("display", "none");

        rollCallCurrentVoter = 0;
        rollCallCurrentVotes = new Array(numPossibleVoters).fill("No Vote");
        rollCallNumNays      = 0;
        rollCallNumYeas      = 0;
        rollCallNumAbstains  = 0;
        hasRollCallFinished  = false;

        $("#rollCallNumVotesNeededToWin").text(Math.ceil((votingCountries.length+1)/2))

        $($(`#rollCallPastChoices`).children().toArray()[rollCallCurrentVoter]).css("background-color", "powderblue");
        
        if(hasBasicFlag(votingCountries[rollCallCurrentVoter])) {
            $("#rollCallFlag").prop("src", `/flags/${basicListOfCountries[votingCountries[rollCallCurrentVoter]]}.svg`);
        } else {
            $("#rollCallFlag").prop("src", `/favicon.png`);
        }
        
        $("#rollCallCountryName").text(votingCountries[rollCallCurrentVoter]);
        $("#rollCallVoterAttendance").text(
            getAttendanceOfVotingCountries()[votingCountries[rollCallCurrentVoter]] == "Pr" ? "Present" : "Present and Voting"
        );
        
        if(getAttendanceOfVotingCountries()[votingCountries[rollCallCurrentVoter]] == "Pr") {
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

    setInterval(function(_e) {
        let t = new Date();
        $("#topRealClock").text(t.getHours() + ":" + (t.getMinutes() < 10 ? "0" : "") + t.getMinutes());
    }, 1000);

    $("#impromptuTimerLabel").val("5:00");
    $("#quickStartAttendance").prop("disabled", true);

    setCurrentCountryList([], true);
    recalcDelegates();

    if(!isMirroring) {
        showQuickStart();
    } else {
        isPopupShown = false;
        showPopup("#mirrorSetupPopup");
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
        //console.log(m.data);
        let dd;
        if(m.data != "Connected") dd = JSON.parse(m.data);
        if(m.data == "Connected") {
            ws.send(JSON.stringify({
                name       : jccData.name,
                salt       : jccData.salt,
                type       : "requestMirrors"
            }));
            console.log("Requesting mirrors...");

            $("#mirrorSecondStep").css("display", "block");
        } else if(dd.type == "heartbeat") {
            ws.send(JSON.stringify({type : "heartbeat"}));
        } else if(dd.type == "crisis") {
            $("#crisisUpdateText").text(dd.messageBody);
            quitPopup(function() {
                $("#exitButtons").css("opacity", "0");
                showPopup("#crisisUpdatePopup");
                $("#crisisSound").attr("src", `/sounds/${dd.sound}.mp3`);
                $("#crisisSound")[0].play();
            });
        } else if(!hasChoosenMirrorable) {
            var d = dd.state;
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

                        if(window.location.href.includes("clock")) {
                            $("#popupPage").css("display", "block");
                            $("#impromptuTimer").css("display", "block");
                            $("#impromptuTimer").css("position", "absolute");
                            $("#impromptuTimer").css("left", "0");
                            $("#impromptuTimer").css("top", "0");
                            $("#impromptuTimer").css("width", "100vw");
                            $("#impromptuTimer").css("height", "100vh");
                            $("#impromptuTimer").css("border-radius", "0");
                            $("#impromptuTimer").css("z-index", "13");

                            $("#impromptuTimer").css("display", "block");
                            $("#impromptuTimerLabel").css("font-size", "50vh");
                            $("#impromptuTimerLabel").text("--:--");
                    
                            $("#impromptuStaticLabel").remove();
                        }
                    })
                );
                $("#listOfMirrorables").append($("<br>"));
            }
            seenStates[d.mySalt] = d;
        } else {
            if(JSON.parse(m.data).state.mySalt == chosenMirrorableSalt) {
                //console.log(JSON.parse(m.data).state);
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
        let d = JSON.parse(m.data);
        if(d.type == "heartbeat") {
            ws.send(JSON.stringify({type : "heartbeat"}));
        } else if(d.type == "returnSalt" && d.salt) {
            mySalt = d.salt;
            resendMirror();
        } else if(d.type == "requestMirrors") {
            resendMirror();
        } else if(d.type == "message") {
            if(d.messageBody.startsWith("!crisis")) {
                let crisisMessage = "";
                d.messageBody.substring(8).split(" ").forEach((el) => {
                    if(el.startsWith("-S")) {
                        $("#crisisSound").attr("src", `/sounds/${el.substring(2)}.mp3`);
                    } else {
                        crisisMessage += el + " ";
                    }
                });

                $("#crisisUpdateText").text(crisisMessage.trim());
                quitPopup(function() {
                    $("#exitButtons").css("opacity", "0");
                    showPopup("#crisisUpdatePopup");
                    $("#crisisSound")[0].play();
                });
            }
        }
        //console.log(d);
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
        $(el).css("background-color", "#fff");
        $(el).find(".colorMePlease").css("background-color", $(el).attr("data-bg-color"));
    });
    if(proceeds) rollCallCurrentVoter++;
    if(rollCallCurrentVoter == numPossibleVoters) {
        rollCallCurrentVoter--;
        //hasRollCallFinished = true;
    }
    $($(`#rollCallPastChoices`).children().toArray()[rollCallCurrentVoter]).css("background-color", "powderblue");

    let listOfVotingCountries = getListOfVotingCountries();

    //if(proceeds) $(`#rollCallPastChoices`).children().toArray()[rollCallCurrentVoter].scrollIntoView({behavior: "smooth"});

    if(hasBasicFlag(listOfVotingCountries[rollCallCurrentVoter])) {
        $("#rollCallFlag").prop("src", `/flags/${basicListOfCountries[listOfVotingCountries[rollCallCurrentVoter]]}.svg`);
    } else {
        $("#rollCallFlag").prop("src", `/favicon.png`);
    }

    $("#rollCallCountryName").text(listOfVotingCountries[rollCallCurrentVoter]);
    $("#rollCallVoterAttendance").text(
        getAttendanceOfVotingCountries()[listOfVotingCountries[rollCallCurrentVoter]] == "Pr" ? "Present" : "Present and Voting"
    );

    if(getAttendanceOfVotingCountries()[listOfVotingCountries[rollCallCurrentVoter]] == "Pr") {
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

        $($("#rollCallPastChoices").children().get(rollCallCurrentVoter)).attr("data-bg-color", "#999");
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

        dictOfCustomDelegates : dictOfCustomDelegates,

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

    toReturn.attendance = getAttendanceOfVotingCountries();

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
        } else if(t["type"] == "custom") {
            t["topic"] = inputs[0].value;
            t["duration"] = stringToDuration(inputs[1].value);
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
                toReturn.currentMotion.chosenCountries.push($(this).children()[2].textContent);
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

function motionToElement(mot) {
    var toReturn;
    if(mot.type == "mod") {
        toReturn = $("#modMotionPrefab").clone(true);
        var inputList = toReturn.find("input");
        inputList[0].value = mot.topic;
        inputList[1].value = durationToString(mot.totalDuration);
        inputList[1].textContent = durationToString(mot.totalDuration);

        if(inputList.length > 2) {
            inputList[2].value = durationToString(mot.delegateDuration);
            inputList[2].textContent = durationToString(mot.delegateDuration);
        }
    } else if(mot.type == "unmod") {
        toReturn = $("#unmodMotionPrefab").clone(true);
        var inputList = toReturn.find("input");
        inputList[0].value = mot.topic;
        inputList[0].textContent = mot.topic;

        if(inputList.length > 1) {
            inputList[1].value = durationToString(mot.duration);
            inputList[1].textContent = durationToString(mot.duration);
        }
    } else if(mot.type == "roundRobin") {
        toReturn = $("#roundRobinMotionPrefab").clone(true);
        var inputList = toReturn.find("input");
        inputList[0].value = mot.topic;
        inputList[0].textContent = mot.topic;

        if(inputList.length > 1) {
            inputList[1].value = durationToString(mot.delegateDuration);
            inputList[1].textContent = durationToString(mot.delegateDuration);
        }
    } else if(mot.type == "speakersList") {
        toReturn = $("#speakersListMotionPrefab").clone(true);
        var inputList = toReturn.find("input");
        inputList[0].value = mot.numberOfSpeakers;
        inputList[0].textContent = mot.numberOfSpeakers;

        if(inputList.length > 1) {
            inputList[1].value = durationToString(mot.delegateDuration);
            inputList[1].textContent = durationToString(mot.delegateDuration);
        }
    } else if(mot.type == "presentPapers") {
        toReturn = $("#presentPapersMotionPrefab").clone(true);
    } else if(mot.type == "custom") {
        toReturn = $("#customMotionPrefab").clone();
        var inputList = toReturn.find("input");

        $(inputList[0]).attr("disabled", true);
        inputList[0].value = mot.topic;
        inputList[0].textContent = mot.topic;

        if(inputList.length > 1) {
            inputList[1].value = durationToString(mot.duration);
            inputList[1].textContent = durationToString(mot.duration);
        }
    }

    if(isMirroring) {
        toReturn.find("input").toArray().forEach((el) => {
            /* if(!$(el).attr("disabled")) */ if(!$(el).hasClass("customMotionNameInput")) $(el).replaceWith($("<span>").append(document.createTextNode(el.value)));
        });
        toReturn.find("button").remove();
    }

    toReturn.attr("id", "");

    return toReturn;
}

function implementStateJSON(newState) {
    if("success" in newState && !newState.success) { // Network sent an error =(
        createAlert(`Request unsuccessful with error code ${newState.code}: ${newState.message}`);
        console.log(newState);
        return;
    }

    //console.log(newState);
    
    var newMotions = [];
    let listOfIds = []; // Ids of sent motions to quickly parse afterwards

    if(isMirroring) { // Tried to make the transition work all nice. I failed.... then tried again and got it! (and it's so much shorter to boot)
        for(mi in newState.proposedMotions) {
            let mot = newState.proposedMotions[mi];
            listOfIds.push(mot.rngid);
            if($(`div[data-rngid=${mot.rngid}]`).length == 0) { // Check if motion is not already present on screen
                newMotions.push(mot);
            } else {
                let c = motionToElement(mot);
                $(`div[data-rngid=${mot.rngid}]`).replaceWith(c.attr("data-rngid", mot.rngid));
            }
        }
    } else {
        $("#motiondisplays > *").remove();
        newMotions = newState.proposedMotions;
    }

    if(!isMirroring) {
        hidePopup();
    } else {
        if(isPopupShown && !window.location.href.includes("clock")) {
            if(newState.isImpromptuTimerOpen && $("#impromptuTimer").css("display") != "none") { // Trust the process ig
                
            } else if(newState.isThereARollCall && $("#rollCallVotePopup").css("display") != "none") {
                
            } else {
                hidePopup();
            }
        }
    }

    setCustomDelegates(newState.dictOfCustomDelegates);

    setCurrentCountryList(Object.keys(newState.attendance));

    recalcDelegates();

    refreshAttendanceNodes();
    implementAttendanceList(newState.attendance);

    $("#allAbsentButton").click();
    recalcDelegates();

    $("#leftbottomarea").css("opacity", "1");
    $("#leftbottomarea").css("display", "");

    if(isMirroring) {
        $("#committeeName").text(newState.committeeName);
    } else {
        if(newState.committeeName != "[No name]") {
            $("#committeeName").val(newState.committeeName);
        } else {
            $("#committeeName").val("");
        }
    }

    if(!newState.isThereACurrentMotion) {
        $("#rightbottomarea").animate({
            opacity : 0
        }, 150, function() {
            $("#rightbottomarea").css("display", "none");
        });
        for(var i = 0; i < newMotions.length; i++) {
            var cm = newMotions[i];
            var toAdd = motionToElement(cm);

            toAdd.attr("data-rngid", cm.rngid);

            if(toAdd) appendMotion(toAdd);
        }

        $("#motiondisplays > div").each(function(_el) {
            if(listOfIds.indexOf($(this).attr("data-rngid")) == -1) killMotionDisplayParent($(this)); //$(this).remove();
        });
        var listedMotions = $("#motiondisplays > div").detach().toArray().sort(function(first, second) {
            if(listOfIds.indexOf($(first).attr("data-rngid")) < listOfIds.indexOf($(second).attr("data-rngid"))) {
                return -1;
            }
            return 1;
        });
        
        $.each(listedMotions, function(_index, el) {
            $("#motiondisplays").append(el);
        });

        $("#leftbottomarea").css("opacity", "1");
    } else {
        parsePassedMotionJSON(newState.currentMotion);

        currentMotion = newState.currentMotion;

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

        
        if(window.location.href.includes("clock")) {
            $("#impromptuTimerLabel").text(durationToString(newState.currentMotion.currentTime));
        }
    }

    if(newState.isImpromptuTimerOpen) {
        $("#impromptuTimerButton").click();

        $("#impromptuTimerLabel").val(durationToString(newState.impromptuTime));
        $("#impromptuTimerLabel").text(durationToString(newState.impromptuTime));
    }
    
    if(window.location.href.includes("clock") && !newState.isThereACurrentMotion && !newState.isImpromptuTimerOpen) {
        $("#impromptuTimerLabel").text("--:--");
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

    /* dictOfBasicDelegates = { };
    basicListOfCountries.forEach((el) => {
        dictOfBasicDelegates[el] = {canVote : !nonVotingBasicMembers.includes(el)}
    }); */
}