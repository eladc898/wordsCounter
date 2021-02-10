"use strict";
const fs = require('fs'),
    utilityService = require('./utilityService');

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

    write(caller, data) {
        const fName = 'write';
        if (!logFile) {
            return utilityService.createServerError(fName, "Log file is missing");
        }

        logFile.write(`${caller}: ${data}\n`);
    }
}

module.exports = loggerService;
