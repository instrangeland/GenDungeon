// ProceduralTA is licensed under GNU General Public License v3.0.

'use strict';

function command(match, test, callback) {
    match = match.split(' ');

    if (match.length !== test.length) {
        return false;
    }

    const args = [];
    for (const [index, testWord] of test.entries()) {
        const matchWords = match[index].split(',');
        if (!matchWords.includes(testWord) && !matchWords.includes('#')) {
            return false;
        }
        if (matchWords.includes('#')) {
            args.push(testWord);
        }
    }

    callback(args);
    return true;
}