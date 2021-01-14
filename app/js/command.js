// ProceduralTA is licensed under GNU General Public License v3.0.

'use strict';

/**
 * Checks if a given input matches a command and runs code if it does.
 * @param match The command to match against, e.g. "look,inspect #"
 * @param test The input to check
 * @param callback The code to run if the input matches
 * @return {boolean} Whether the code ran
 */
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