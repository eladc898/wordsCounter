"use strict";

const mongoose     = require('mongoose'),
    Schema       = mongoose.Schema,
    dic = require('../dictionary');

const words = new Schema({
    created: { type: Date, default: Date.now },
    name: String,
    count: {type: Number, default: 0}

}, { autoIndex: false });

module.exports = mongoose.model(dic.CONSTANTS.mongoCollections.word, words);
