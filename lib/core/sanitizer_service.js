const { NormalizeService } = require('./normalize_service');

/**
 * Provides utilities for sanitizing sensitive log data.
 * Useful for masking confidential fields such as passwords and tokens.
 */
class SanitizerService {
    /**
     * Object map containing field names that should be sanitized.
     * Keys are normalized to lowercase.
     *
     * @type {Record<string, boolean>}
     */
    static #sanitizeFields = {
        password: true,
        senha: true,
        token: true,
    };

    /**
     * Replacement value used when sensitive data is sanitized.
     *
     * @type {string}
     */
    static redactValue = '[REDACTED]';

    /**
     * Adds new field names to the sanitization list.
     *
     * @param {string[]} option - List of field names to sanitize.
     * @throws {TypeError} Thrown when the provided value is not an array.
     * @returns {void}
     */
    static updateSanitizeFields(option) {
        if (Array.isArray(option) === false) {
            throw new TypeError(
                `To update '#sanitizeFields', the value must be an array of strings.`
            );
        }

        const optionNormalized = option.map(
            (element) => NormalizeService.lower(element)
        );

        const optionObject = array_to_object(optionNormalized);

        const merge = {
            ...SanitizerService.#sanitizeFields,
            ...optionObject
        };

        SanitizerService.#sanitizeFields = merge;
    }

    /**
     * Updates the replacement text used for sanitized fields.
     *
     * @param {string} censorship - Replacement text for sensitive values.
     * @throws {TypeError} Thrown when the provided value is not a string.
     * @returns {void}
     */
    static updateSanitizeValue(value) {
        if (typeof value !== 'string') {
            throw new TypeError(
                'The value must be a string.'
            );
        }

        SanitizerService.redactValue = value;
    }

    /**
     * Recursively sanitizes sensitive fields inside an object.
     *
     * @param {Object} data - Object to sanitize.
     * @returns {Object} Sanitized object.
     */
    static sanitizeData(data) {
        let keys = Object.keys(data);

        for (let key = 0; key < keys.length; key++) {
            const value = data[keys[key]];

            if (value !== null && typeof value === 'object') {
                data[keys[key]] = this.sanitizeData(value);
            } else {
                const keyData = NormalizeService.lower(keys[key]);
                const keyNormalized = this.#sanitizeFields[keyData];

                if (keyNormalized !== undefined) {
                    data[keys[key]] = SanitizerService.redactValue;
                }
            }
        }

        return data;
    }
}

module.exports = { SanitizerService }