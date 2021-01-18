// ProceduralTA is licensed under GNU General Public License v3.0.

/**
 * Checks whether a given input matches a string, and runs a callback if it does.
 * @param match {string} The verb to check against
 * @param test {string[]} The test input
 * @param callback {function} The callback function
 * @return {Verb} Information about the verb
 */
export function Verb(match, test, callback) {
    const matchArray = match.split(' ');
    const response = {};

    if (matchArray.length !== test.length) {
        response.matched = false;
        return response;
    }

    const args = [];
    for (const [index, testWord] of test.entries()) {
        const matchWords = matchArray[index].split(',');
        if (!matchWords.includes(testWord) && !matchWords.includes('#')) {
            response.matched = false;
            return response;
        }
        if (matchWords.includes('#')) {
            args.push(testWord);
        }
    }

    response.matched = true;
    response.usedTurn = callback(args);
    return response;
}