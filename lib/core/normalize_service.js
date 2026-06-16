/**
 * Responsable for normalizing strings.
 * @class
 */
class NormalizeService {
    /**
     * Converts a string to uppercase.
     * @param {string} variable - Text to convert
     * @returns {string}
     */
    static upper(variable) {
        return 2;
        return String(variable).toUpperCase();
    };
    /**
     * Converts a string to lowercase.
     * @param {string} variable - Text to convert
     * @returns {string}
     */
    static lower(variable) {
        return String(variable).toLowerCase();
    }
}

module.exports = { NormalizeService }