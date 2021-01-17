// ProceduralTA is licensed under GNU General Public License v3.0.

/**
 * Checks whether a given input matches a string, and runs a callback if it does.
 * @param match {string} The verb to check against
 * @param test {string[]} The test input
 * @param callback {function} The callback function
 * @return {boolean} Whether the test input matched
 */
export function Verb(match, test, callback) {
    const matchArray = match.split(' ');

    if (matchArray.length !== test.length) {
        return false;
    }

    const args = [];
    for (const [index, testWord] of test.entries()) {
        const matchWords = matchArray[index].split(',');
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