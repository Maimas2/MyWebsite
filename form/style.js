// Start an id with . to not send it to the server eg. for just display slides
var questionSet = {
    title : "Test Question Set",
    confirmBeforeStart : true,
    modules : [
        {
            randomize : false,
            questions : [
                {
                    id : ".predemographics",
                    type : "message",
                    prompt : "We'll start with some non-identifying demographics."
                },
                // {
                //     id : "name",
                //     type : "openended",
                //     prompt : "Your name (OPTIONAL)",
                //     optional : true
                // },
                {
                    id : "grade",
                    type : "mcq",
                    prompt : "Which grade are you in?",
                    choices : [
                        "Freshman",
                        "Sophomore",
                        "Junior",
                        "Senior"
                    ]
                },
                {
                    id : "gender",
                    type : "mcq",
                    prompt : "What is your gender?",
                    choices : [
                        "Male",
                        "Female",
                        "Non-Binary / Other"
                    ]
                },
                {
                    id : "race",
                    type : "mcq",
                    prompt : "Which of the following best describes your race?",
                    choices : [
                        "White",
                        "Black or African American",
                        "Asian",
                        "Multiracial",
                        "Other"
                    ]
                },
                {
                    id : "classlevel",
                    type : "mcq",
                    prompt : "Which best describes the approximate level of class you have taken at WHS?",
                    choices : [
                        "Standard",
                        "Advanced",
                        "Honors / A.P."
                    ]
                },
                {
                    id : "party",
                    type : "mcq",
                    prompt : "Which of the following political parties do your beliefs best align with?",
                    choices : [
                        "Unsure / Don't know",
                        "Democratic Party",
                        "Republican Party",
                        "Another party"
                    ]
                },
                {
                    id : ".premessageinfo",
                    type : "message",
                    prompt : "PLEASE READ: For each of the following statements, respond with how strongly you agree with the sentiment. You will likely agree with some and disagree with others. If you feel differently about different parts of the same statement, combine your feelings into one aggregate answer."
                }
            ]
        },
        {
            randomize : false, // Two warm-up questions for the format
            questions : [
                {
                    id : ".test1",
                    type : "mcq",
                    prompt : "The established authorities generally turn out to be right about things, while the radicals and protestors are usually just \"loud mouths\" showing off their ignorance.",
                    choices : ["Very strongly disagree", "Strongly disagree", "Moderately disagree", "Slightly disagree", "Neutral / No Opinion / Unsure", "Slightly Agree", "Moderately Agree", "Strongly Agree", "Very strongly agree"]
                },
                {
                    id : ".test2",
                    type : "mcq",
                    prompt : "Women should have to promise to obey their husbands when they get married.",
                    choices : ["Very strongly disagree", "Strongly disagree", "Moderately disagree", "Slightly disagree", "Neutral / No Opinion / Unsure", "Slightly Agree", "Moderately Agree", "Strongly Agree", "Very strongly agree"]
                },
            ]
        },
        {
            randomize : true,
            questions : [
                {
                    id : "test3",
                    type : "mcq",
                    prompt : "Our country desperately needs a mighty leader who will do what has to be done to destroy the radical new ways and sinfulness that are ruining us.",
                    choices : ["Very strongly disagree", "Strongly disagree", "Moderately disagree", "Slightly disagree", "Neutral / No Opinion / Unsure", "Slightly Agree", "Moderately Agree", "Strongly Agree", "Very strongly agree"],
                    returnvalues : [1, 2, 3, 4, 5, 6, 7, 8, 9]
                },
                {
                    id : "test4",
                    type : "mcq",
                    prompt : "Gays and lesbians are just as healthy and moral as anybody else.",
                    choices : ["Very strongly disagree", "Strongly disagree", "Moderately disagree", "Slightly disagree", "Neutral / No Opinion / Unsure", "Slightly Agree", "Moderately Agree", "Strongly Agree", "Very strongly agree"],
                    returnvalues : [9, 8, 7, 6, 5, 4, 3, 2, 1]
                },
                {
                    id : "test5",
                    type : "mcq",
                    prompt : "It is always better to trust the judgment of the proper authorities in government and religion than to listen to the noisy rabble-rousers in our society who are trying to create doubt in people's minds",
                    choices : ["Very strongly disagree", "Strongly disagree", "Moderately disagree", "Slightly disagree", "Neutral / No Opinion / Unsure", "Slightly Agree", "Moderately Agree", "Strongly Agree", "Very strongly agree"],
                    returnvalues : [1, 2, 3, 4, 5, 6, 7, 8, 9]
                },
                {
                    id : "test6",
                    type : "mcq",
                    prompt : "Atheists and others who have rebelled against the established religions are no doubt every bit as good and virtuous as those who attend church regularly.",
                    choices : ["Very strongly disagree", "Strongly disagree", "Moderately disagree", "Slightly disagree", "Neutral / No Opinion / Unsure", "Slightly Agree", "Moderately Agree", "Strongly Agree", "Very strongly agree"],
                    returnvalues : [9, 8, 7, 6, 5, 4, 3, 2, 1]
                },
                {
                    id : "test7",
                    type : "mcq",
                    prompt : "The only way our country can get through the crisis ahead is to get back to our traditional values, put some tough leaders in power, and silence the troublemakers spreading bad ideas.",
                    choices : ["Very strongly disagree", "Strongly disagree", "Moderately disagree", "Slightly disagree", "Neutral / No Opinion / Unsure", "Slightly Agree", "Moderately Agree", "Strongly Agree", "Very strongly agree"],
                    returnvalues : [1, 2, 3, 4, 5, 6, 7, 8, 9]
                },
                {
                    id : "test8",
                    type : "mcq",
                    prompt : "There is absolutely nothing wrong with nudist camps.",
                    choices : ["Very strongly disagree", "Strongly disagree", "Moderately disagree", "Slightly disagree", "Neutral / No Opinion / Unsure", "Slightly Agree", "Moderately Agree", "Strongly Agree", "Very strongly agree"],
                    returnvalues : [9, 8, 7, 6, 5, 4, 3, 2, 1]
                },
                {
                    id : "test9",
                    type : "mcq",
                    prompt : "Our country <u>needs</u> free thinkers who have the courage to defy traditional ways, even if this upsets many people.",
                    choices : ["Very strongly disagree", "Strongly disagree", "Moderately disagree", "Slightly disagree", "Neutral / No Opinion / Unsure", "Slightly Agree", "Moderately Agree", "Strongly Agree", "Very strongly agree"],
                    returnvalues : [9, 8, 7, 6, 5, 4, 3, 2, 1]
                },
                {
                    id : "test10",
                    type : "mcq",
                    prompt : "Our country will be destroyed someday if we do not smash the perversions eating away at our moral fiber and traditional beliefs.",
                    choices : ["Very strongly disagree", "Strongly disagree", "Moderately disagree", "Slightly disagree", "Neutral / No Opinion / Unsure", "Slightly Agree", "Moderately Agree", "Strongly Agree", "Very strongly agree"],
                    returnvalues : [1, 2, 3, 4, 5, 6, 7, 8, 9]
                },
                {
                    id : "test11",
                    type : "mcq",                                                          // | Removed "sexual" here
                    prompt : "Everyone should have their own lifestyle, religious beliefs, and preferences, even if it makes them different from everyone else.",
                    choices : ["Very strongly disagree", "Strongly disagree", "Moderately disagree", "Slightly disagree", "Neutral / No Opinion / Unsure", "Slightly Agree", "Moderately Agree", "Strongly Agree", "Very strongly agree"],
                    returnvalues : [9, 8, 7, 6, 5, 4, 3, 2, 1]
                },
                {
                    id : "test12",
                    type : "mcq",
                    prompt : "The “old-fashioned ways” and the “old-fashioned values” still show the best way to live.",
                    choices : ["Very strongly disagree", "Strongly disagree", "Moderately disagree", "Slightly disagree", "Neutral / No Opinion / Unsure", "Slightly Agree", "Moderately Agree", "Strongly Agree", "Very strongly agree"],
                    returnvalues : [1, 2, 3, 4, 5, 6, 7, 8, 9]
                },
                {
                    id : "test13",
                    type : "mcq",
                    prompt : "You have to admire those who challenged the law and the majority's view by protesting for women's abortion rights, for animal rights, or to abolish school prayer.",
                    choices : ["Very strongly disagree", "Strongly disagree", "Moderately disagree", "Slightly disagree", "Neutral / No Opinion / Unsure", "Slightly Agree", "Moderately Agree", "Strongly Agree", "Very strongly agree"],
                    returnvalues : [9, 8, 7, 6, 5, 4, 3, 2, 1]
                },
                {
                    id : "test14",
                    type : "mcq",
                    prompt : "What our country really needs is a strong, determined leader who will crush evil, and take us back to our true path.",
                    choices : ["Very strongly disagree", "Strongly disagree", "Moderately disagree", "Slightly disagree", "Neutral / No Opinion / Unsure", "Slightly Agree", "Moderately Agree", "Strongly Agree", "Very strongly agree"],
                    returnvalues : [1, 2, 3, 4, 5, 6, 7, 8, 9]
                },
                {
                    id : "test15",
                    type : "mcq",
                    prompt : "Some of the best people in our country are those who are challenging our government, criticizing religion, and ignoring the “normal way things are supposed to be done.”",
                    choices : ["Very strongly disagree", "Strongly disagree", "Moderately disagree", "Slightly disagree", "Neutral / No Opinion / Unsure", "Slightly Agree", "Moderately Agree", "Strongly Agree", "Very strongly agree"],
                    returnvalues : [9, 8, 7, 6, 5, 4, 3, 2, 1]
                },
                {
                    id : "test16",
                    type : "mcq",                      // Replaced "pornography" with "adult film"
                    prompt : "God's laws about abortion, adult film, and marriage must be strictly followed before it is too late, and those who break them must be strongly punished.",
                    choices : ["Very strongly disagree", "Strongly disagree", "Moderately disagree", "Slightly disagree", "Neutral / No Opinion / Unsure", "Slightly Agree", "Moderately Agree", "Strongly Agree", "Very strongly agree"],
                    returnvalues : [1, 2, 3, 4, 5, 6, 7, 8, 9]
                },
                {
                    id : "test17",
                    type : "mcq",
                    prompt : "There are many radical, immoral people in our country today, who are trying to ruin it for their own godless purposes, whom the authorities should put out of action.",
                    choices : ["Very strongly disagree", "Strongly disagree", "Moderately disagree", "Slightly disagree", "Neutral / No Opinion / Unsure", "Slightly Agree", "Moderately Agree", "Strongly Agree", "Very strongly agree"],
                    returnvalues : [1, 2, 3, 4, 5, 6, 7, 8, 9]
                },
                {
                    id : "test18",
                    type : "mcq",
                    prompt : "A “woman's place” should be wherever she wants to be. The days when women are submissive to their husbands and social conventions belong strictly in the past.",
                    choices : ["Very strongly disagree", "Strongly disagree", "Moderately disagree", "Slightly disagree", "Neutral / No Opinion / Unsure", "Slightly Agree", "Moderately Agree", "Strongly Agree", "Very strongly agree"],
                    returnvalues : [9, 8, 7, 6, 5, 4, 3, 2, 1]
                },
                {
                    id : "test19",
                    type : "mcq",
                    prompt : "Our country will be great if we honor the ways of our forefathers, do what the authorities tell us to do, and get rid of the “rotten apples” who are ruining everything.",
                    choices : ["Very strongly disagree", "Strongly disagree", "Moderately disagree", "Slightly disagree", "Neutral / No Opinion / Unsure", "Slightly Agree", "Moderately Agree", "Strongly Agree", "Very strongly agree"],
                    returnvalues : [1, 2, 3, 4, 5, 6, 7, 8, 9]
                },
                {
                    id : "test20",
                    type : "mcq",
                    prompt : "There is no “ONE right way” to live life; everybody has to create their <u>own</u> way.",
                    choices : ["Very strongly disagree", "Strongly disagree", "Moderately disagree", "Slightly disagree", "Neutral / No Opinion / Unsure", "Slightly Agree", "Moderately Agree", "Strongly Agree", "Very strongly agree"],
                    returnvalues : [9, 8, 7, 6, 5, 4, 3, 2, 1]
                },
                {
                    id : "test21",
                    type : "mcq",
                    prompt : "Homosexuals and feminists should be praised for being brave enough to defy “traditional family values.",
                    choices : ["Very strongly disagree", "Strongly disagree", "Moderately disagree", "Slightly disagree", "Neutral / No Opinion / Unsure", "Slightly Agree", "Moderately Agree", "Strongly Agree", "Very strongly agree"],
                    returnvalues : [9, 8, 7, 6, 5, 4, 3, 2, 1]
                },
                {
                    id : "test22",
                    type : "mcq",
                    prompt : "This country would work a lot better if certain groups of troublemakers would just shut up and accept their group’s traditional place in society",
                    choices : ["Very strongly disagree", "Strongly disagree", "Moderately disagree", "Slightly disagree", "Neutral / No Opinion / Unsure", "Slightly Agree", "Moderately Agree", "Strongly Agree", "Very strongly agree"],
                    returnvalues : [1, 2, 3, 4, 5, 6, 7, 8, 9]
                }
            ]
        }
    ]
};

var questionsToPose = { // Id-based lookup table of question. Don't destruct! Contains response data.
    
}

var ogIdOrder = [ // Original question order for return to server

]

var toPresentIdOrder = [ // Compiled order of question ids to show

];

var currentQuestionId = -10;

var isTransitioning = false;

function goToNextQuestion() {
    if(currentQuestionId == -10 || isTransitioning) return; // Uninitialized

    isTransitioning = true;
    
    if(currentQuestionId >= 0) {
        let currentQuestion = questionsToPose[toPresentIdOrder[currentQuestionId]];

        if(currentQuestion.type == "mcq") {
            currentQuestion.response = null;
            for(let i = 0; i < 10; i++) {
                if($(`#radio${i}`).prop("checked")) {
                    if(currentQuestion.returnvalues && currentQuestion.returnvalues.length) {
                        currentQuestion.response = currentQuestion.returnvalues[i];
                    } else {
                        currentQuestion.response = currentQuestion.choices[i];
                    }
                }
            }
        } else if(currentQuestion.type == "openended") {
            currentQuestion.response = $("#openendedInput").val();
        } else if(currentQuestion.type == "message") {
            // Pass
        }
    }

    currentQuestionId++;
    if(currentQuestionId < 0) currentQuestionId = 0;

    if(currentQuestionId < toPresentIdOrder.length) {
        currentQuestion = questionsToPose[toPresentIdOrder[currentQuestionId]];

        $("input").attr("disabled", true);
        
        $("#bigContainer").animate({
            "opacity" : "0"
        }, 150, function() {
            $(".optionChoice").css("display", "none");
            if(currentQuestion.type == "mcq") {
                $("#radioResponse").css("display", "block");
                $(".radioContainer").css("display", "none");

                $(".radioContainer").each(function(_e) {
                    if(_e >= currentQuestion.choices.length) return;
                    $(this).find("label").html(currentQuestion.choices[_e]);
                    $(this).css("display", "");

                    if(_e > 0) $(this).prev().css("border-bottom", "0")
                    $(this).css("border-bottom", "");
                });
            } else if(currentQuestion.type == "openended") {
                $("#openEndedResponse").css("display", "flex");
                if(currentQuestion.optional) $("#openendedInput").attr("placeholder", "(Optional)");
                else $("#openendedInput").attr("placeholder", "");
            } else if(currentQuestion.type == "message") {
                // Pass
            }

            if(currentQuestion.type == "mcq" || (currentQuestion.type == "openended" && !currentQuestion.optional)) {
                $("#confirmButton").attr("disabled", true);
            }

            $("input").prop("checked", false);

            $("#bigLabel").html(currentQuestion.prompt);

            $("#bigContainer").animate({
                "opacity" : "1"
            }, 150, function() {
                $("input").attr("disabled", false);
                isTransitioning = false;
            });
        });
    } else {
        $("input").attr("disabled", true);

        let toSubmit = {  };

        let totalRwa = 0;

        ogIdOrder.forEach((id) => {
            if(!id.startsWith(".")) {
                toSubmit[id] = questionsToPose[id].response
            }
            if(id.startsWith("test")) totalRwa += questionsToPose[id].response;
        });

        toSubmit.totalRwa = totalRwa;

        console.log(toSubmit);

        $.ajax({
            type    : "POST",
            url     : "/submitresults",
            contentType: 'application/json',
            success : function(_r) {
                $("#bigLabel").text(`Thank you for filling out this form! Your answers have been submitted, and you may close this page.\n${totalRwa}`);
            },
            error   : function(_r) {
                $("#bigLabel").text(`An error occured submitting your responses. Please copy the data below and alert Alex. ${JSON.stringify(toSubmit)}`);
            },
            data    : JSON.stringify(toSubmit)
        });
        
        $("#bigContainer").animate({
            "opacity" : "0"
        }, 150, function() {
            $(".optionChoice").css("display", "none");
            $("#confirmButton").css("display", "none");

            $("#bigLabel").text("Submitting responses...");

            $("#bigContainer").animate({
                "opacity" : "1"
            }, 150, function() {
                isTransitioning = false;
            });
        });
    }
}

function shuffleArrayYayKnuth(arr) { // I don't care
    for(let i = 0; i < arr.length; i++) {
        let randpos = Math.floor(Math.random() * arr.length);
        [arr[i], arr[randpos]] = [arr[randpos], arr[i]];
    }
}

window.onload = function() {
    // Compile question set
    if(questionSet.confirmBeforeStart) {
        $(".optionChoice").css("display", "none");
        $("#confirmButton").css("display", "block");
        currentQuestionId = -1;
    } else {
        currentQuestionId = 0;
    }

    for(let m in questionSet.modules) {
        let module = questionSet.modules[m];
        for(let qi in module.questions) {
            let q = module.questions[qi];
            ogIdOrder.push(q.id);
            questionsToPose[q.id] = q; // Yes, it would overwrite in the case of duplicate ids. I don't particularly care, I make the question sets.
        }
        if(!module.randomize) {
            for(let qi in module.questions) {
                let q = module.questions[qi];
                toPresentIdOrder.push(q.id);
            }
        } else {
            shuffleArrayYayKnuth(module.questions)
            for(let qi in module.questions) {
                let q = module.questions[qi];
                toPresentIdOrder.push(q.id);
            }
        }
    }

    $(".radioContainer").on("click touchstart", function(_e) {
        if(_e.target != this) return;
        $(this).find("input[type=radio]").click();
    });

    $("input[type=radio]").on("click touchstart", function() {
        $("#confirmButton").attr("disabled", false);
    });

    $("#confirmButton").on("touchstart mousedown", goToNextQuestion);
};

window.onerror = function(msg, url, linenumber) {
    alert('Error message: '+msg+'\nURL: '+url+'\nLine Number: '+linenumber);
    return true;
}