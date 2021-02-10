"use strict";

const request = require('supertest'),
    expect = require('chai').expect,
    utilityService = require('../services/utilityService'),
    path = require('path');

describe('Utility Service Spec', () => {

    it('Count Words - fail', done => {
        const payload = '';
        const wordsCounter = utilityService.countWords(payload);
        expect(wordsCounter).to.equal(undefined);
        done();
    });

    it('Count Words - fail', done => {
        const payload = ['Hello from test 123, sdad'];
        const wordsCounter = utilityService.countWords(payload);
        expect(wordsCounter).to.equal(undefined);
        done();
    });

    it('Count Words - success', done => {
        const payload = 'Hi! My name is (what?), my name is (who?), my name is Slim Shady';
        const wordsCounter = utilityService.countWords(payload);
        expect(wordsCounter['my']).to.equal(3);
        expect(wordsCounter['what']).to.equal(1);
        expect(wordsCounter['?']).to.equal(undefined);
        done();
    });

});
