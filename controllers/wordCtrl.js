"use strict";
const dic = require('../dictionary');
const wordService = require('../services/wordService');

const wordCtrl = {

    countWords(req, res) {
        try {
            wordService.countWords(req.body).then(() => {
                res.status(201).json('(ok)');
            }, err => {
                res.status(err && err.error || dic.CONSTANTS.errorTypes.user).json(err);
            });
        }
        catch (ex) {
            res.status(dic.CONSTANTS.errorTypes.server).json(ex && ex.stack);
        }
    },

    getWordStatistics(req, res) {
        try {
            wordService.getWordStatistics(req.query.word).then((wordCount) => {
                res.status(200).json(wordCount);
            }, err => {
                res.status(err.error).json(err);
            });
        }
        catch (ex) {
            res.status(dic.CONSTANTS.errorTypes.server).json(ex && ex.stack);
        }
    }
};


module.exports = wordCtrl;
