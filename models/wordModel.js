"use strict";

const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    dic = require('../dictionary');

const words = new Schema({
    created: { type: Date, default: Date.now },
    name: {type: String, index: {unique: true, dropDups: true}},
    count: {type: Number, default: 0}

});

module.exports = mongoose.model(dic.CONSTANTS.mongoCollections.word, words);
