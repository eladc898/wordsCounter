"use strict";

const axios = require('axios'),
	csv = require('csv-parser'),
	fs = require('fs');

const dataService = {

	async getServers() {
		const serversUrl = 'http://interview.vulcancyber.com:3000/servers';
		const headers = {Authorization: 'Aa123456!'};
		const res = await dataService.getData(serversUrl, headers);
		if (res.status !== 200) {
			throw new Error('Could not get servers');
		}
		return res.data;
	},

	async getVulnerabilities() {
		const vulnsUrl = 'http://interview.vulcancyber.com:3000/vulns';
		const body = {
			startId: 1,
			amount: 10
		};

		const res = await dataService.postData(vulnsUrl, body);
		if (res.status !== 200) {
			throw new Error('Could not get vulns');
		}
		return res.data;
	},

	getData(url, headers, params) {
		return axios.get(url, {
			headers: headers || {},
			params: params || {},
			responseType: 'json'
		});
	},

	postData(url, body, headers) {
		return axios.post(url, body, {
			headers: headers || {},
			responseType: 'json'
		});
	},

	readCsvFile(path) {
		const rules = [];
		return new Promise((resolve, reject) => {
			fs.createReadStream(path)
			.pipe(csv())
			.on('data', (data) => rules.push(data))
			.on('err', (err) => reject(err))
			.on('end', () => {
				return resolve(rules);
			});
		});
	}
};

module.exports = dataService;
