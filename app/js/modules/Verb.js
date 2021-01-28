/*
 * GenDungeon is licensed under GNU General Public License v3.0.
 */

/**
 * A handler for verbs used by the input parser.
 */
export default class Verb {
    /**
     * Checks whether a given input matches a string, and runs a callback if it does.
     * @param {string} match The verb to check against
     * @param {string[]} test The test input
     * @param {Function} callback The callback function
     * @return {Verb} Information about the verb
     */
    static check(match, test, callback) {
        const matchArray = match.split(' ');
        const args = [];

        if (matchArray.length > test.length) {
            return {
                matched: false
            };
        }

        for (const [index, testWord] of test.entries()) {
            if (index < matchArray.length) {
                const matchWords = matchArray[index].split(',');
                if (!matchWords.includes(testWord) && !matchWords.includes('#')) {
                    return {
                        matched: false
                    };
                }
                if (matchWords.includes('#')) {
                    args.push(testWord);
                }
            }
        }

        return {
            matched: true,
            usedTurn: callback(args)
        };
    }
}