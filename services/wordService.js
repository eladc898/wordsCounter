"use strict";

const utilityService = require('./utilityService'),
    dbService = require('./dbService'),
    dataService = require('./dataService'),
    fs = require('fs'),
    q = require('q'),
    dic = require('../dictionary'),
    _ = require('lodash'),
    wordModel = require('../models/wordModel'),
    logFile = fs.createWriteStream(__dirname + '/../application.log', {flags : 'w'});

const wordService = {

    async countWords(requestData) {
        const fName = 'countWords';

        if (!requestData || !requestData.type || !requestData.text) {
            return Promise.reject(utilityService.createUserError(fName, dic.ERRORS.invalidCountParam));
        }

        try {
            switch (requestData.type) {
                case dic.CONSTANTS.dataType.text:
                    await handleText(requestData.text);
                    break;

                case dic.CONSTANTS.dataType.file:
                    await handleFilePath(requestData.text);
                    break;

                case dic.CONSTANTS.dataType.url:
                    await handleUrl(requestData.text);
                    break;

                default:
                    return utilityService.createUserError(fName, dic.ERRORS.invalidType)
            }
        }
        catch (e) {
            throw e;
        }
    },

    async getWordStatistics(word) {
        const fName = 'getWordStatistics';
        if (!word) {
            return Promise.reject(utilityService.createUserError(fName, dic.ERRORS.invalidWordParam));
        }
        try {
            const query = {name: word.toLowerCase()};
            const select = 'count';
            const wordObj = await dbService.mongoFindOneObj(wordModel, query, select, null, null);
            return wordObj.count;
        }
        catch (e) {
            throw e;
        }
    }
}

async function handleText(text) {
    try {
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
    let chunkCounter = 0;
    return new Promise((resolve, reject) => {
        stream.on('data', async (chunk) => {
            chunkCounter++;
            console.log(`Handling chunk: ${chunkCounter}`);
            if (chunk.length) {
                await handleText(chunk);
            }
        }).on('error', err => {
            reject(err)
        }).on('end', function() {
            resolve();
        });
    });
}

async function handleUrl(url) {
    const fName = 'handleUrl';
    if (!url || !url.match(RegExp(dic.CONSTANTS.urlRegex))) {
        return Promise.reject(utilityService.createUserError(fName, dic.ERRORS.invalidUrl));
    }

    // const request = await dataService.getData(url);
    // console.log(request.data);

    // return await handleStreamData(request);

    /*var http = require('http');

    var options = {
        host: url
    }
    var request = http.get(url, function (res) {
        var data = '';
        res.on('data', function (chunk) {
            data += chunk;
        });
        res.on('end', function () {
            console.log(data);

        });
    });
    request.on('error', function (e) {
        console.log(e.message);
    });
    request.end();*/
}

async function handleFilePath(path) {
    const fName = 'handleFilePath';
    if (!path || !path.endsWith('txt')) {
        return Promise.reject(utilityService.createUserError(fName, dic.ERRORS.invalidFile));
    }

    const readStream = await fs.createReadStream(path,{ highWaterMark: 128 * dic.CONSTANTS.oneKb, encoding: 'utf8' });
    return await handleStreamData(readStream);
}

async function saveRecords(wordsCounter) {
    try {
        const results = await saveRecordsExecute(wordsCounter);
        let isFailure = _.find(results, {state: 'rejected'});
        if (isFailure) {
            return new Error(isFailure.reason);
        }
    }
    catch (err) {
        await Promise.reject(err);
    }
}

async function saveRecordsExecute(wordsCounter) {
    const options = {upsert: true};

    let promises = [];

    for (const [word, count] of Object.entries(wordsCounter)) {
        promises.push(new Promise((resolve, reject) => {
            dbService.mongoFindOneAndUpdate(wordModel, {name: word}, {$inc: { count: count}}, options).then(() => {
                resolve();
            }).catch(err => {
                reject(err);
            });
        }));
    }

    try {
        return await Promise.allSettled(promises);
    }
    catch (err) {
        await Promise.reject(err);
    }
}

module.exports = wordService;
