/**
 * Converts an array of strings into an object map.
 * Each array item becomes a key with value `true`.
 *
 * @function
 * @param {string[]} array - Array of strings
 * @returns {Record<string, true>}
 */
function arrayToObject(array) {
    if (!Array.isArray(array)) {
        throw new TypeError('Expected an array of string(s)');
    }

    const result = {};

    for (const item of array) {
        if (typeof item !== 'string') continue;
        result[item] = true;
    }

    return result;
}

module.exports = { arrayToObject };