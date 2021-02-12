"use strict";
const fs = require('fs'),
    utilityService = require('./utilityService'),
    dic = require('../dictionary');

let logFile;
const loggerService = {

    upsertLogFile(path) {
        try {
            fs.readFileSync(path);
            logFile = fs.createWriteStream(path, {flags : 'a'});
        }
        catch (error) {
            logFile = fs.createWriteStream(path, {flags : 'w'});
        }
    },

    writeError(caller, data) {
        write(caller, dic.CONSTANTS.logsType.error, data);
    },

    writeInfo(caller, data) {
        write(caller, dic.CONSTANTS.logsType.info, data);
    }
}

function write(caller, type, data) {
    const fName = 'write';
    if (!logFile) {
        return utilityService.createServerError(fName, "Log file is missing");
    }

    logFile.write(`${Date.now()} - ${type} - ${caller}: ${data}\n`);
}

module.exports = loggerService;
