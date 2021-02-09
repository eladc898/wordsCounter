"use strict";

const utilityService = require('./utilityService'),
    dataService = require('./dataService'),
    fs = require('fs'),
    logFile = fs.createWriteStream(__dirname + '/../detections.log', {flags : 'w'});

const alertsService = {

    async getAlerts() {
        try {
            const servers = await dataService.getServers();
            const vulns = await dataService.getVulnerabilities();
            const rules = await dataService.readCsvFile('assets/rules.csv');
            let parsedRules = parseRules(rules);
            const relevantServers = getRelevantServersVulns(servers, parsedRules.server);
            const relevantVulns = getRelevantServersVulns(vulns, parsedRules.vuln);
            return checkAffectedServers(relevantServers, relevantVulns);
        }
        catch (e) {
            throw e;
        }
    }
}

function checkAffectedServers(servers, vulns) {
    if (!servers || !servers.length || !vulns || !vulns.length) return;
    let parsedAffects, vulnOs, vulnOsVersion;
    servers.forEach(server => {
        vulns.forEach(vuln => {
            if (vuln.affects) {
                parsedAffects = vuln.affects.split('_');
                vulnOs = parsedAffects[0];
                vulnOsVersion = parsedAffects[1];
                if (server.os === vulnOs && server.osVersion === vulnOsVersion) {
                    logFile.write(`vulnerability ${vuln.name} with risk ${vuln.risk} discovered on ${server.hostname} ${server.ip}\n`);
                }
            }
        });
    });
}

function getRelevantServersVulns(items, rules) {
    if (!rules || !rules.length) return items;
    let rule;
    // go over servers/vulnerabilities and match accordding to the given rules
    return items.filter(item => {
        for (let i = 0; i < rules.length; i++) {
            rule = rules[i];
            if (rule.parameter && item[rule.parameter]) {
                // parse id/risk to int/float so the comparison will work
                // move 'id'/'risk' to constants
                if (rule.parameter === 'id') {
                    rule.value = parseInt(rule.value);
                    item[rule.parameter] = parseInt(item[rule.parameter]);
                }
                else if (rule.parameter === 'risk') {
                    rule.value = parseFloat(rule.value);
                    item[rule.parameter] = parseFloat(item[rule.parameter]);
                }
                switch (rule.operator) {
                    // move 'eq'/'gt'/'lt' to constants
                    case 'eq':
                        //filter out all unmatching items by rule.operator
                        if (item[rule.parameter] !== rule.value) {
                            return false;
                        }
                        break;
                    case 'gt':
                        if (item[rule.parameter] < rule.value) {
                            return false;
                        }
                        break;
                    case 'lt':
                        if (item[rule.parameter] > rule.value) {
                            return false;
                        }
                        break;

                    default:
                        //skip this rule - do nothing
                }
            }
        }
        return true;
    });

}

// divide rules to server/vuln rules by type
function parseRules(rules) {
    let parsedRules = {
        server: [],
        vuln: []
    };
    rules.forEach(rule => {
        if (rule.type === 'server') {
            parsedRules.server.push(rule);
        }
        else if (rule.type === 'vulnerability') {
            parsedRules.vuln.push(rule);
        }
    });

    return parsedRules;
}

module.exports = alertsService;
