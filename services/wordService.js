"use strict";

const utilityService = require('./utilityService'),
    loggerService = require('./loggerService'),
    dbService = require('./dbService'),
    dataService = require('./dataService'),
    fs = require('fs'),
    util = require('util'),
    dic = require('../dictionary'),
    _ = require('lodash'),
    wordModel = require('../models/wordModel');

const wordService = {

    async countWords(requestData) {
        const fName = 'countWords';

        if (!requestData || !requestData.type || !requestData.payload) {
            return Promise.reject(utilityService.createUserError(fName, dic.ERRORS.invalidCountParam));
        }

        try {
            loggerService.write(fName, `request type: ${requestData.type}`);

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
            loggerService.write(fName, e);
            throw e;
        }
    },

    async getWordStatistics(word) {
        const fName = 'getWordStatistics';
        if (!word) {
            return Promise.reject(utilityService.createUserError(fName, dic.ERRORS.invalidWordParam));
        }
        try {
            loggerService.write(fName, `Get statistics for word: ${word}`);

            const query = {name: word.toLowerCase()};
            const select = 'count';
            const options = {name: dic.CONSTANTS.word};
            const wordObj = await dbService.mongoFindOneObj(wordModel, query, select, null, options);

            loggerService.write(fName, `Word count: ${wordObj.count}`);
            return wordObj.count;
        }
        catch (e) {
            // Object not found in the db
            if (e.message === util.format(dic.ERRORS.objNotFound, dic.CONSTANTS.word)) {
                loggerService.write(fName, `Word count: 0`);
                return 0;
            }
            else {
                loggerService.write(fName, e);
                throw e;
            }
        }
    }
}

async function parseTextAndSaveToDb(text) {
    const fName = 'parseTextAndSaveToDb';
    try {
        loggerService.write(fName, `about to count words`);
        const wordsCounter = utilityService.countWords(text);
        if (wordsCounter) {
            await saveRecords(wordsCounter);
        }
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
            loggerService.write(fName, `Handling chunk: ${chunkCounter}`);
            if (chunk.length) {
                if (typeof chunk !== 'string') {
                    chunk = chunk.toString();
                }
                await parseTextAndSaveToDb(chunk);
            }
        }).on('error', err => {
            loggerService.write(fName, err);
            reject(err)
        }).on('end', function() {
            resolve();
            loggerService.write(fName, `Finish handling ${chunkCounter} chunks`);
        });
    });
}

async function handleUrl(url) {
    const fName = 'handleUrl';
    if (!url || !url.match(RegExp(dic.CONSTANTS.urlRegex))) {
        return Promise.reject(utilityService.createUserError(fName, dic.ERRORS.invalidUrl));
    }

    loggerService.write(fName, `get read stream for url: ${url}`);
    const stream = await dataService.getHttpData(url);
    return await handleStreamData(stream);
}

async function handleFilePath(path) {
    const fName = 'handleFilePath';
    if (!path || !path.endsWith('txt')) {
        return Promise.reject(utilityService.createUserError(fName, dic.ERRORS.invalidFile));
    }

    loggerService.write(fName, `get read stream for file path: ${path}`);
    const readStream = await fs.createReadStream(path,{ highWaterMark: 128 * dic.CONSTANTS.oneKb, encoding: 'utf8' });
    return await handleStreamData(readStream);
}

async function saveRecords(wordsCounter) {
    const fName = 'saveRecords';

    try {
        loggerService.write(fName, `save words counter to DB - start`);
        const results = await saveRecordsExecute(wordsCounter);
        let isFailure = _.find(results, {state: 'rejected'});
        if (isFailure) {
            return new Error(isFailure.reason);
        }
        loggerService.write(fName, `save words counter to DB - end`);
    }
    catch (err) {
        await Promise.reject(err);
    }
}

async function saveRecordsExecute(wordsCounter) {
    const fName = 'saveRecordsExecute';
    const options = {upsert: true};

    let promises = [];

    for (const [word, count] of Object.entries(wordsCounter)) {
        promises.push(new Promise((resolve, reject) => {
            dbService.mongoFindOneAndUpdate(wordModel, {name: word}, {$inc: { count: count}}, options).then(() => {
                resolve();
            }).catch(err => {
                loggerService.write(fName, 'saving chunk to DB - failed');
                reject(err);
            });
        }));
    }

    try {
        return await Promise.allSettled(promises);
    }
    catch (err) {
        loggerService.write(fName, 'saving to DB - failed');
        await Promise.reject(err);
    }
}

module.exports = wordService;
