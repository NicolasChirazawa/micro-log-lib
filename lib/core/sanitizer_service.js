const { NormalizerService } = require('./normalizer_service');
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
    #sanitizeFields;

    /**
     * Replacement value used when sensitive data is sanitized.
     *
     * @type {string}
     */
    #redactValue;

    constructor(redactValue, sanitizerFields) {
        const standartRedactValue =   '[REDACTED]';
        const standartSanitizeFields= {
            'token': true,
            'password': true,
            'senha': true,
        };

        this.#redactValue = 
            redactValue ? redactValue : standartRedactValue;
        this.#sanitizeFields = 
            sanitizerFields ? sanitizerFields : standartSanitizeFields;
    }

    /**
     * Adds new field names to the sanitization list.
     *
     * @param {string[]} option - List of field names to sanitize.
     * @throws {TypeError} Thrown when the provided value is not an array.
     * @returns {void}
     */
    addSanitizeFields(option) {
        if (
            Array.isArray(option) === false &&
            typeof option !== 'string'
        ) {
            throw new TypeError(
                `To update 'sanitizeFields', the value must be an array of strings or a string.`
            );
        }

        if (typeof option === 'string') {
            option = NormalizerService.lower(option);
            this.#sanitizeFields[option] = true;
            return;
        }

        let optionNormalized = [];
        for (let i = 0; i < option.length; i++) {
            if (typeof option[i] !== 'string') {
                throw new TypeError(
                    `The value must be an array of string(s).`
                );
            };
            optionNormalized.push(NormalizerService.lower(option[i]));
        };

        const optionObject = arrayToObject(optionNormalized);
        const merge = {
            ...this.#sanitizeFields,
            ...optionObject,
        };

        this.#sanitizeFields = merge;
    };

    /**
     * Get the fields of the sanitization list.
     *
     * @returns {Object}
     */
    getSanitizeFields() {
        return this.#sanitizeFields;
    };

    /**
     * Reset the fields of the sanitization list.
     * Used unique for unitary test purpose.
     *
     * @returns {Object}
     */
    resetSanitizeFields() {
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
    getRedactValue(value) {
        return this.#redactValue;
    }

    /**
     * Updates the replacement text used for sanitized fields.
     *
     * @param {string} censorship - Replacement text for sensitive values.
     * @throws {TypeError} Thrown when the provided value is not a string.
     */
    updateRedactValue(value) {
        if (typeof value !== 'string') {
            throw new TypeError(
                'The value must be a string.'
            );
        }

        this.#redactValue = value;
    }

    /**
     * Recursively sanitizes sensitive fields inside an object.
     *
     * @param {Object} data - Object to sanitize.
     * @returns {Object} Sanitized object.
     */
    sanitize(data) {
        let keys = Object.keys(data);

        for (let key = 0; key < keys.length; key++) {
            const value = data[keys[key]];

            if (value !== null && typeof value === 'object') {
                data[keys[key]] = this.sanitize(value);
            } else {
                const keyNormalized = NormalizerService.lower(keys[key]);
                const keyData = this.#sanitizeFields[keyNormalized];

                if (keyData !== undefined) {
                    data[keys[key]] = this.#redactValue;
                }
            }
        }
        return data;
    }

    /**
     * Return a new instance of the 'SanitizerService'.
     *
     * @returns {Object} SanitizerService - New instance of 'SanitizerService'.
     */
    clone() {
        return new SanitizerService(
            this.#redactValue,
            this.#sanitizeFields,
        )
    }
}

module.exports = { SanitizerService }