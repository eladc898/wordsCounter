"use strict";

const utilityService = require('./utilityService'),
    loggerService = require('./loggerService'),
    dbService = require('./dbService'),
    dataService = require('./dataService'),
    fs = require('fs'),
    util = require('util'),
    dic = require('../dictionary'),
    wordModel = require('../models/wordModel');

const wordService = {

    async countWords(requestData) {
        const fName = 'countWords';

        if (!requestData || !requestData.type || !requestData.payload) {
            return Promise.reject(utilityService.createUserError(fName, dic.ERRORS.invalidCountParam));
        }

        try {
            loggerService.writeInfo(fName, `request type: ${requestData.type}`);

            switch (requestData.type) {
                case dic.CONSTANTS.dataType.text:
                    await parseTextAndSaveToDb(requestData.payload);
                    break;

                case dic.CONSTANTS.dataType.file:
                    await handleFilePath(requestData.payload);
                    break;

                case dic.CONSTANTS.dataType.url:
                    await handleUrl(requestData.payload);
                    break;

                default:
                    return utilityService.createUserError(fName, dic.ERRORS.invalidType)
            }
        }
        catch (e) {
            loggerService.writeError(fName, 'count words failed');
            throw e;
        }
    },

    async getWordStatistics(word) {
        const fName = 'getWordStatistics';
        if (!word) {
            return Promise.reject(utilityService.createUserError(fName, dic.ERRORS.invalidWordParam));
        }
        try {
            loggerService.writeInfo(fName, `Get statistics for word: ${word}`);

            const query = {name: word.toLowerCase()};
            const select = 'count';
            const options = {name: dic.CONSTANTS.word};
            const wordObj = await dbService.mongoFindOneObj(wordModel, query, select, null, options);

            loggerService.writeInfo(fName, `Word count: ${wordObj.count}`);
            return wordObj.count;
        }
        catch (e) {
            // Object not found in the db
            if (e.message === util.format(dic.ERRORS.objNotFound, dic.CONSTANTS.word)) {
                loggerService.writeInfo(fName, `Word count: 0`);
                return 0;
            }
            else {
                loggerService.writeError(fName, e);
                throw e;
            }
        }
    }
}

async function parseTextAndSaveToDb(text) {
    const fName = 'parseTextAndSaveToDb';
    try {
        loggerService.writeInfo(fName, `about to count words`);
        const wordsCounter = utilityService.countWords(text);
        if (!wordsCounter) {
            return Promise.reject(utilityService.createUserError(fName, dic.ERRORS.invalidText));
        }
        return await saveRecords(wordsCounter);
    }
    catch (e) {
        throw e;
    }
}

async function handleStreamData(stream) {
    const fName = 'handleStreamData';

    let chunkCounter = 0;
    return new Promise((resolve, reject) => {
        stream.on('data', async (chunk) => {
            chunkCounter++;
            loggerService.writeInfo(fName, `Handling chunk: ${chunkCounter}`);
            if (chunk.length) {
                if (typeof chunk !== 'string') {
                    chunk = chunk.toString();
                }
                // Resolve after the first chunk to avoid losing connection with the client(request timeout)
                if (chunkCounter === 1) {
                    resolve();
                }
                await parseTextAndSaveToDb(chunk);
            }
        }).on('error', err => {
            loggerService.writeError(fName, err);
            reject(err);
        }).on('end', function() {
            loggerService.writeInfo(fName, `Finish handling ${chunkCounter} chunks`);
        });
    });
}

async function handleUrl(url) {
    const fName = 'handleUrl';
    if (!url || !url.match(RegExp(dic.CONSTANTS.urlRegex))) {
        return Promise.reject(utilityService.createUserError(fName, dic.ERRORS.invalidUrl));
    }

    loggerService.writeInfo(fName, `get read stream for url: ${url}`);
    const stream = await dataService.getHttpData(url);
    if (!stream) {
        return Promise.reject(utilityService.createUserError(fName, util.format(dic.ERRORS.noDataUrl, url)));
    }
    return await handleStreamData(stream);
}

async function handleFilePath(path) {
    const fName = 'handleFilePath';
    if (!path || !path.endsWith('txt')) {
        return Promise.reject(utilityService.createUserError(fName, dic.ERRORS.invalidFile));
    }

    try {
        fs.readFileSync(path);
        loggerService.writeInfo(fName, `get read stream for file path: ${path}`);
        const stream = await fs.createReadStream(path,{ highWaterMark: 128 * dic.CONSTANTS.oneKb, encoding: 'utf8' });
        await handleStreamData(stream);
    }
    catch (err) {
        if (err.code === dic.CONSTANTS.fileError) {
            return Promise.reject(utilityService.createUserError(fName, util.format(dic.ERRORS.fileNotFound, path)));
        }
        await Promise.reject(utilityService.createUserError(fName, err));
    }

}

async function saveRecords(wordsCounter) {
    const fName = 'saveRecords';

    try {
        loggerService.writeInfo(fName, `save words counter to DB - start`);
        await saveRecordsExecute(wordsCounter);
        loggerService.writeInfo(fName, `save words counter to DB - end`);
    }
    catch (err) {
        await Promise.reject(err);
    }
}

async function saveRecordsExecute(wordsCounter) {
    const fName = 'saveRecordsExecute';

    let updateData = [];

    for (const [word, count] of Object.entries(wordsCounter)) {
        updateData.push({query: {name: word}, updateData: {$inc: { count: count}}});
    }

    try {
        await dbService.mongoBulkUpdate(wordModel, updateData);
    }
    catch (err) {
        loggerService.writeError(fName, 'saving to DB - failed');
        await Promise.reject(err);
    }
}

module.exports = wordService;
