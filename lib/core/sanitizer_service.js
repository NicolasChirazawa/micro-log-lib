const { NormalizeService } = require('./normalize_service');
const { arrayToObject } = require('./utils/array_to_object');

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
    static #redactValue = '[REDACTED]';

    /**
     * Adds new field names to the sanitization list.
     *
     * @param {string[]} option - List of field names to sanitize.
     * @throws {TypeError} Thrown when the provided value is not an array.
     * @returns {void}
     */
    static addSanitizeFields(option) {
        if (
            Array.isArray(option) === false &&
            typeof option !== 'string'
        ) {
            throw new TypeError(
                `To update 'sanitizeFields', the value must be an array of strings or a string.`
            );
        }

        if (typeof option === 'string') {
            option = NormalizeService.lower(option);
            SanitizerService.#sanitizeFields[option] = true;
            return;
        }

        let optionNormalized = [];
        for (let i = 0; i < option.length; i++) {
            if (typeof option[i] !== 'string') {
                throw new TypeError(
                    `The value must be an array of string(s).`
                );
            };
            optionNormalized.push(NormalizeService.lower(option[i]));
        };

        const optionObject = arrayToObject(optionNormalized);
        const merge = {
            ...SanitizerService.#sanitizeFields,
            ...optionObject,
        };

        SanitizerService.#sanitizeFields = merge;
    };

    /**
     * Get the fields of the sanitization list.
     *
     * @returns {Object}
     */
    static getSanitizeFields() {
        return this.#sanitizeFields;
    };

    /**
     * Reset the fields of the sanitization list.
     * Used unique for unitary test purpose.
     *
     * @returns {Object}
     */
    static resetSanitizeFields() {
        const resetSanitizeFields = {
            password: true,
            senha: true,
            token: true, 
        };

        this.#sanitizeFields = resetSanitizeFields;
    };

    /**
     * Updates the replacement text used for sanitized fields.
     *
     * @throws {TypeError} Thrown when the provided value is not a string.
     * @returns {string}
     */
    static getRedactValue(value) {
        return SanitizerService.#redactValue;
    }

    /**
     * Updates the replacement text used for sanitized fields.
     *
     * @param {string} censorship - Replacement text for sensitive values.
     * @throws {TypeError} Thrown when the provided value is not a string.
     */
    static updateRedactValue(value) {
        if (typeof value !== 'string') {
            throw new TypeError(
                'The value must be a string.'
            );
        }

        SanitizerService.#redactValue = value;
    }

    /**
     * Recursively sanitizes sensitive fields inside an object.
     *
     * @param {Object} data - Object to sanitize.
     * @returns {Object} Sanitized object.
     */
    static sanitize(data) {
        let keys = Object.keys(data);

        for (let key = 0; key < keys.length; key++) {
            const value = data[keys[key]];

            if (value !== null && typeof value === 'object') {
                data[keys[key]] = this.sanitize(value);
            } else {
                const keyNormalized = NormalizeService.lower(keys[key]);
                const keyData = this.#sanitizeFields[keyNormalized];

                if (keyData !== undefined) {
                    data[keys[key]] = SanitizerService.#redactValue;
                }
            }
        }
        return data;
    }
}

module.exports = { SanitizerService }