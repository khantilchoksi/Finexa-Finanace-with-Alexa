//Author: Khantil Choksi


'use strict';

const Alexa = require('alexa-sdk');
//const recipes = require('./recipes');

const APP_ID = "amzn1.ask.skill.8b8ef500-8119-4d12-a062-a906a07011c8"; // TODO replace with your app ID (OPTIONAL).

const languageStrings = {
    'en': {
        translation: {
            // TODO: Update these messages to customize.
            SKILL_NAME: 'Finance with Alexa',
            WELCOME_MESSAGE: "Welcome to %s. You can ask a question like, what is my weekly expense for food? ... Now, what can I help you with?",
            WELCOME_REPROMPT: 'For instructions on what you can say, please say help me.',
            DISPLAY_CARD_TITLE: '%s  - Recipe for %s.',
            HELP_MESSAGE: "You can ask questions such as, what\'s my weekly expense for food, or, you can say exit...Now, what can I help you with?",
            HELP_REPROMPT: "You can say things like, what\'s my weekly expense for food, or, you can say exit...Now, what can I help you with?",
            STOP_MESSAGE: 'Goodbye!',
            EXPENSE_REPEAT_MESSAGE: 'Try saying repeat.',
            EXPENSE_NOT_FOUND_MESSAGE: "I\'m sorry, I currently do not know ",
            EXPENSE_NOT_FOUND_WITH_ITEM_NAME: 'the expense for %s. ',
            EXPENSE_NOT_FOUND_WITHOUT_ITEM_NAME: 'that expense. ',
            EXPENSE_NOT_FOUND_REPROMPT: 'What else can I help with?',
        },
    },
};

const handlers = {
    //Use LaunchRequest, instead of NewSession if you want to use the one-shot model
    // Alexa, ask [my-skill-invocation-name] to (do something)...
    'LaunchRequest': function () {
        this.attributes.speechOutput = this.t('WELCOME_MESSAGE', this.t('SKILL_NAME'));
        // If the user either does not reply to the welcome message or says something that is not
        // understood, they will be prompted again with this text.
        this.attributes.repromptSpeech = this.t('WELCOME_REPROMPT');

        this.response.speak(this.attributes.speechOutput).listen(this.attributes.repromptSpeech);
        this.emit(':responseReady');
    },
    'StartOverIntent': function () {
        this.attributes.speechOutput = this.t('WELCOME_MESSAGE', this.t('SKILL_NAME'));
        // If the user either does not reply to the welcome message or says something that is not
        // understood, they will be prompted again with this text.
        this.attributes.repromptSpeech = this.t('WELCOME_REPROMPT');

        this.response.speak(this.attributes.speechOutput).listen(this.attributes.repromptSpeech);
        this.emit(':responseReady');
    },
    // 'MainIntent': function () {
    //     const itemSlot = this.event.request.intent.slots.Item;
    //     let itemName;
    //     if (itemSlot && itemSlot.value) {
    //         itemName = itemSlot.value.toLowerCase();
    //     }

    //     const cardTitle = this.t('DISPLAY_CARD_TITLE', this.t('SKILL_NAME'), itemName);
    //     const myRecipes = this.t('RECIPES');
    //     const recipe = myRecipes[itemName];

    //     if (recipe) {
    //         this.attributes.speechOutput = recipe;
    //         this.attributes.repromptSpeech = this.t('RECIPE_REPEAT_MESSAGE');

    //         this.response.speak(recipe).listen(this.attributes.repromptSpeech);
    //         this.response.cardRenderer(cardTitle, recipe);
    //         this.emit(':responseReady');
    //     } else {
    //         let speechOutput = this.t('RECIPE_NOT_FOUND_MESSAGE');
    //         const repromptSpeech = this.t('RECIPE_NOT_FOUND_REPROMPT');
    //         if (itemName) {
    //             speechOutput += this.t('RECIPE_NOT_FOUND_WITH_ITEM_NAME', itemName);
    //         } else {
    //             speechOutput += this.t('RECIPE_NOT_FOUND_WITHOUT_ITEM_NAME');
    //         }
    //         speechOutput += repromptSpeech;

    //         this.attributes.speechOutput = speechOutput;
    //         this.attributes.repromptSpeech = repromptSpeech;

    //         this.response.speak(speechOutput).listen(repromptSpeech);
    //         this.emit(':responseReady');
    //     }
    // },
    'AMAZON.HelpIntent': function () {
        this.attributes.speechOutput = this.t('HELP_MESSAGE');
        this.attributes.repromptSpeech = this.t('HELP_REPROMPT');

        this.response.speak(this.attributes.speechOutput).listen(this.attributes.repromptSpeech);
        this.emit(':responseReady');
    },
    // 'AMAZON.RepeatIntent': function () {
    //     this.response.speak(this.attributes.speechOutput).listen(this.attributes.repromptSpeech);
    //     this.emit(':responseReady');
    // },
    'AMAZON.StopIntent': function () {
        this.response.speak("Goodbye!");
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak("Goodbye!");
        this.emit(':responseReady');
    },
    'SessionEndedRequest': function () {
        console.log(`Session ended: ${this.event.request.reason}`);
    },
    'Unhandled': function () {
        this.attributes.speechOutput = this.t('HELP_MESSAGE');
        this.attributes.repromptSpeech = this.t('HELP_REPROMPT');
        this.response.speak(this.attributes.speechOutput).listen(this.attributes.repromptSpeech);
        this.emit(':responseReady');
    },
};

exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};