/**
 Author: Khantil Choksi
 Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
 http://aws.amazon.com/apache2.0/
 or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

var api_calls = require("./api_calls.js");
'use strict';

 
 /**
  * TODO: Change the questions to make this skill your own!
  */


// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = function (event, context) {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);

    /**
     * TODO: Change this applicationId to your own to prevent someone else from configuring a skill that sends requests to this function
     */
    if (event.session.application.applicationId !== "amzn1.ask.skill.8b8ef500-8119-4d12-a062-a906a07011c8") {
        context.fail("Invalid Application ID");
     }

        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId
        + ", sessionId=" + session.sessionId);

    // add any session init logic here
}

/**
 * Called when the user invokes the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log("onLaunch requestId=" + launchRequest.requestId
        + ", sessionId=" + session.sessionId);
    getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log("onIntent requestId=" + intentRequest.requestId
        + ", sessionId=" + session.sessionId);

    var intent = intentRequest.intent,
        intentName = intentRequest.intent.name;

    // handle yes/no intent after the user has been prompted
    // if (session.attributes && session.attributes.userPromptedToContinue) {
    //     delete session.attributes.userPromptedToContinue;
    //     if ("AMAZON.NoIntent" === intentName) {
    //         handleFinishSessionRequest(intent, session, callback);
    //     } else if ("AMAZON.YesIntent" === intentName) {
    //         handleRepeatRequest(intent, session, callback);
    //     }
    // }

    // dispatch custom intents to handlers here
    // if ("AnswerIntent" === intentName) {
    //     handleAnswerRequest(intent, session, callback);
    // } else if ("AnswerOnlyIntent" === intentName) {
    //     handleAnswerRequest(intent, session, callback);
    // } else if ("DontKnowIntent" === intentName) {
    //     handleAnswerRequest(intent, session, callback);
    // } else if ("AMAZON.YesIntent" === intentName) {
    //     handleAnswerRequest(intent, session, callback);
    // } else if ("AMAZON.NoIntent" === intentName) {
    //     handleAnswerRequest(intent, session, callback);
    // } else

    if( "UserIntent" === intentName){
        handleUserRequest(intent, session, callback);
    } else if( "MainIntent" === intentName){
        handleMainRequest(intent, session, callback);
    } else if ("AMAZON.StartOverIntent" === intentName) {
        getWelcomeResponse(callback);
    } else if ("AMAZON.RepeatIntent" === intentName) {
        handleRepeatRequest(intent, session, callback);
    } else if ("AMAZON.HelpIntent" === intentName) {
        handleGetHelpRequest(intent, session, callback);
    } else if ("AMAZON.StopIntent" === intentName) {
        handleFinishSessionRequest(intent, session, callback);
    } else if ("AMAZON.CancelIntent" === intentName) {
        handleFinishSessionRequest(intent, session, callback);
    } 
    else {
        throw "Invalid intent";
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId
        + ", sessionId=" + session.sessionId);

    // Add any cleanup logic here
}

// ------- Skill specific business logic -------

var CARD_TITLE = "Finexa"; // TODO: Change the card title to make it your own

/**
 * TODO: Change the speechOutput in the welcome response to say your skill's name
 **/
function getWelcomeResponse(callback) {
    var sessionAttributes = {},
        speechOutput = "Welcome to Finance with ALEXA! You can first let me know whose account details you want."+
        "Then, you can ask a question like, what is my weekly expense for food? ... Now, what can I help you with?",
        shouldEndSession = false,
        repromptText = '... For instructions on what you can say, please say help me.';

    // for (i = 0; i < ANSWER_COUNT; i++) {
    //     repromptText += (i+1).toString() + ". " + roundAnswers[i] + ". "
    // }
    speechOutput += repromptText;
    sessionAttributes = {
        "speechOutput": speechOutput,
        "repromptText": repromptText,
    };
    callback(sessionAttributes,
        buildSpeechletResponse(CARD_TITLE, speechOutput, repromptText, shouldEndSession));
}

//intent.slots.Answer.value

function handleUserRequest(intent, session, callback) {
    var sessionAttributes = {};
    var user = intent.slots.User.value;
    console.log(" HANDLING USER REQUEST for \n",user);
    var speechOutput = "Hello,"+user+".  Wait for a moment while I pull out your information. ... You can ask me questions like, what\'s my weekly expense for entertainment?";
    var repromptText = speechOutput;

    sessionAttributes = {
        "user": user,
        "speechOutput": speechOutput,
        "repromptText": repromptText,
    };
    callback(sessionAttributes,
        buildSpeechletResponse(CARD_TITLE, speechOutput, repromptText, false));
}

function handleMainRequest(intent, session, callback) {
        var sessionAttributes = {};
        var speechOutput = "Hello, "+session.attributes.user+" I am working on calculating your expenses!";
        var repromptText = speechOutput;
        var user = session.attributes.user;
        var responseExpense;
        api_calls.getUserExpenseCategory(user).then(function (expense) 
		{
            //var storyboard_url = _.pluck(created_storyboard,"url");
            console.log("Got the API Response!\n");
			responseExpense = expense;
            speechOutput += "... Your total expense is "+expense;
            sessionAttributes = {
                "user": user,
                "speechOutput": speechOutput,
                "repromptText": repromptText,
            };
            
            callback(sessionAttributes,
                buildSpeechletResponse(CARD_TITLE, speechOutput, repromptText, false));
        });
        
        
}

function handleRepeatRequest(intent, session, callback) {
    // Repeat the previous speechOutput and repromptText from the session attributes if available
    // else start a new game session
    if (!session.attributes || !session.attributes.speechOutput) {
        getWelcomeResponse(callback);
    } else {
        callback(session.attributes,
            buildSpeechletResponseWithoutCard(session.attributes.speechOutput, session.attributes.repromptText, false));
    }
}

function handleGetHelpRequest(intent, session, callback) {
    // Provide a help prompt for the user, explaining how the game is played. Then, continue the game
    // if there is one in progress, or provide the option to start another one.

    // Set a flag to track that we're in the Help state.
    session.attributes.userPromptedToContinue = true;

    // Do not edit the help dialogue. This has been created by the Alexa team to demonstrate best practices.

    var speechOutput = "You can ask questions such as, what\'s my weekly expense for food, or, you can say exit...Now, what can I help you with?",
        repromptText = "To give an answer to a question, respond with the number of the answer . "
        + "Would you like to keep playing?";
        var shouldEndSession = false;
    callback(session.attributes,
        buildSpeechletResponseWithoutCard(speechOutput, repromptText, shouldEndSession));
}

function handleFinishSessionRequest(intent, session, callback) {
    // End the session with a "Good bye!" if the user wants to quit the game
    callback(session.attributes,
        buildSpeechletResponseWithoutCard("Good bye!", "", true));
}

// ------- Helper functions to build responses -------


function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: title,
            content: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildSpeechletResponseWithoutCard(output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}