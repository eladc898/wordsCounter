"use strict";
const dic = require('../dictionary');

const utilityService = {

    countWords: (text) => {
        const fName = 'countWords';
        if (!text || !text.length || typeof text !== 'string') {
            return;
        }
        let wordsCounter = {};
        const words = text.replace(dic.CONSTANTS.wordsRegex, ' ').split(' ');

        words.forEach(word => {
            if (!word) return;
            word = word.toLowerCase();
            if (wordsCounter[word]) {
                wordsCounter[word] += 1;
            }
            else {
                wordsCounter[word] = 1;
            }
        });

        return wordsCounter;
    },

    createUserError: function (caller, err, options) {
        const fName = caller || "createUserError";

        let userError = {
            error: dic.CONSTANTS.errorTypes.user,
            message: err || ""
        };

        if (options) {
            Object.keys(options).forEach(key => {
                userError[key] = options[key];
            });
        }

        return userError;
    },

    createServerError: function (caller, err, options) {
        const fName = caller || "createServerError";

        let serverError = {
            error: dic.CONSTANTS.errorTypes.server,
            message: err || ""
        };

        if (options) {
            Object.keys(options).forEach(key => {
                serverError[key] = options[key];
            });
        }

        return serverError;
    }
}

module.exports = utilityService;
