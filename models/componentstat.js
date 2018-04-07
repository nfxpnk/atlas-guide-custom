'use strict';

const fs = require('fs');
const path = require('path');

const postcss = require('postcss');
const scss = require('postcss-scss');

const getComponentStructure = require('./componentstat/getComponentStructure');
const getAtRules = require('./componentstat/getAtRules');
const getRuleSets = require('./componentstat/getRuleSets');
const getDeclarationsStats = require('./componentstat/getDeclarationsStats');

function getStatistic(file, componentPrefix) {
    const fileAST = postcss().process(file, {parser: scss}).root;
    const componentPrefixRegExp = componentPrefix;
    const stats = getDeclarationsStats(fileAST);
    const atRules = getAtRules(fileAST);

    return {
        includes: atRules.includes,
        imports: atRules.imports,
        mediaQuery: atRules.mediaQuery,
        variables: stats.variables,
        componentStructure: getComponentStructure(fileAST, componentPrefixRegExp),
        totalDeclarations: stats.totalDeclarations,
        ruleSets: getRuleSets(fileAST),
        stats: stats.stats
    };
}

function getStatFor(url, componentPrefix) {
    if (path.extname(url) !== '.scss') {
        return;
    }
    return getStatistic(fs.readFileSync(url, 'utf8'), componentPrefix);
}

module.exports = {
    getStatFor: getStatFor
};
