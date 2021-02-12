"use strict";

const request = require('supertest'),
    expect = require('chai').expect,
    dic = require('../dictionary'),
    appUrl = 'http://localhost:3000';

describe('Word Service Spec', () => {

    describe('Count words', () => {
        it('count words with wrong type - fail', function (done) {
            let jsonData = {
                type: '',
                payload: 'Hi! My name is (what?), my name is (who?), my name is Slim Shady'
            };

            request(appUrl)
            .post('/api/v1/word/count')
            .send(jsonData)
            .set("content-type", "application/json")
            .expect(res => {
                expect(res.status, res.text).to.equal(400);
            })
            .end(function (err, res) {
                done(err);
            });
        });

        it('count words with wrong content - fail', function (done) {
            let jsonData = {
                type: dic.CONSTANTS.dataType.text,
                payload: 123
            };

            request(appUrl)
            .post('/api/v1/word/count')
            .send(jsonData)
            .set("content-type", "application/json")
            .expect(res => {
                expect(res.status, res.text).to.equal(400);
            })
            .end(function (err, res) {
                done(err);
            });
        });

        it('count words with text', function (done) {
            let jsonData = {
                type: dic.CONSTANTS.dataType.text,
                payload: 'Hi! My name is (what?), my name is (who?), my name is Slim Shady'
            };

            request(appUrl)
            .post('/api/v1/word/count')
            .send(jsonData)
            .set("content-type", "application/json")
            .expect(res => {
                expect(res.status, res.text).to.equal(201);
            })
            .end(function (err, res) {
                done(err);
            });
        });

        it('count words from non exist file - fail', function (done) {
            let jsonData = {
                type: dic.CONSTANTS.dataType.file,
                payload: __dirname + '/dummy.txt'
            };

            request(appUrl)
            .post('/api/v1/word/count')
            .send(jsonData)
            .set("content-type", "application/json")
            .expect(res => {
                expect(res.status, res.text).to.equal(400);
            })
            .end(function (err, res) {
                done(err);
            });
        });

        it('count words from file', function (done) {
            let jsonData = {
                type: dic.CONSTANTS.dataType.file,
                payload: __dirname + '/../assets/10kb.txt'
            };

            request(appUrl)
            .post('/api/v1/word/count')
            .send(jsonData)
            .set("content-type", "application/json")
            .expect(res => {
                expect(res.status, res.text).to.equal(201);
            })
            .end(function (err, res) {
                done(err);
            });
        });

        it('count words from safe URL - fail', function (done) {
            let jsonData = {
                type: dic.CONSTANTS.dataType.url,
                payload: 'https://google.com'
            };

            request(appUrl)
            .post('/api/v1/word/count')
            .send(jsonData)
            .set("content-type", "application/json")
            .expect(res => {
                expect(res.status, res.text).to.equal(400);
            })
            .end(function (err, res) {
                done(err);
            });
        });

        it('count words from URL', function (done) {
            let jsonData = {
                type: dic.CONSTANTS.dataType.url,
                payload: 'http://google.com'
            };

            request(appUrl)
            .post('/api/v1/word/count')
            .send(jsonData)
            .set("content-type", "application/json")
            .expect(res => {
                expect(res.status, res.text).to.equal(201);
            })
            .end(function (err, res) {
                done(err);
            });
        });
    });

    describe('Word statistics', () => {
        it('missing query parameter - fail', function (done) {
            let params = {word: ''};

            request(appUrl)
            .get('/api/v1/word/statistics')
            .set("content-type", "application/json")
            .query(params)
            .expect(res => {
                expect(res.status, res.text).to.equal(400);
            })
            .end(function (err, res) {
                done(err);
            });
        });

        it('any word with numbers - count is 0', function (done) {
            let params = {word: 'hi1'};

            request(appUrl)
            .get('/api/v1/word/statistics')
            .set("content-type", "application/json")
            .query(params)
            .expect(res => {
                expect(res.status, res.text).to.equal(200);
                expect(res.body).to.equal(0);
            })
            .end(function (err, res) {
                done(err);
            });
        });

        it('test some word - success', function (done) {

            let params = {word: 'hello'};

            request(appUrl)
            .get('/api/v1/word/statistics')
            .set("content-type", "application/json")
            .query(params)
            .expect(res => {
                expect(res.status, res.text).to.equal(200);
            })
            .end(function (err, res) {
                done(err);
            });
        });
    });
});
