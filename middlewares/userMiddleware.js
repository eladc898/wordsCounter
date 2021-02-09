"use strict";

const path = require('path'),
    utilityService = require('../services/utilityService');

const verifyAdmin = function (req, res, next) {
    const fName = "verifyAdmin";
    return next();
    // return res.status(noPermError.error).json(noPermError);
};


module.exports = verifyAdmin;
