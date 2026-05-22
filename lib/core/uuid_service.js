const { randomUUID } = require('node:crypto');

/**
 * Responsible for generating shortened UUID-like identifiers.
 * Useful for logging and tracing purposes.
 * @class
 */
class UUIDService {
    /**
     * Generate a shortened UUID-like identifier based on UUID v4..
     * @returns {string}
     */
    static generate() {
        return randomUUID().replaceAll('-', '').slice(0, 20);
    };
};

module.exports = { UUIDService }