/**
 * Accumulate the context of father logs.
 * @class
 */
class ContextService {
    /**
     * @type {Object} - Collection data
     */
    #collection;
    constructor(collection) {
        this.#collection = collection;
        this.#validateCreateContext(this.#collection);
    }

    /**
     * Create a context into the instance class.
     *
     * @param {Object} data - Data on context
     * @param {String} service_name - Service name
     * @param {Object} context - Context on class
     */
    create(data) {
        this.#validateCreateContext(data);
        this.#collection = this.inject(data)
    };

    /**
     * Create a context into a class.
     *
     * @param {Object|undefined} data - Data on context
     * @param {String} service_name - Service name
     * @param {Object|undefined} context - Context on class
     * 
     * @throws {TypeError} Thrown when the push any errorList into the array 
     */
    #validateCreateContext(data, context) {
        let errorList = [];

        if (typeof data !== 'object' && data !== null) {
            const error = '"data" has to be an object';
            errorList.push(error);
        };
        if (typeof context !== 'object' && context !== undefined) {
            const error = '"context" has to be an object';
            errorList.push(error);
        };

        if (errorList.length > 0) {
            throw new TypeError(errorList.join('\n\r'));
        };
        return;
    }

    /**
     * Use the context of the class to merge with the class attribute.
     *
     * @param {Object | null} data - Data on context
     * @param {String} service_name - Service name
     *      
     * @returns {String} [service_name=''] service_name - Service name
     */
    inject(data) {
        const contextKeys = Object.keys(this.#collection);
        if (contextKeys.length === 0) return data;

        const dataKeys = Object.keys(data);
        const contextData = this.#injectContext(dataKeys, contextKeys);

        if (typeof contextData !== 'object' && contextData !== null) { 
            throw new TypeError('"Data" must be an object');
        };

        return contextData;
    };

    /**
     * Use the context of the class to merge with the class attribute.
     *
     * @param {Object | null} data - Data on context
     * @param {String} service_name - Service name
     *      
     * @returns {String} [service_name=''] service_name - Service name
     */
    #injectContext(dataKeys, contextKeys) {
        for (let i = 0; i < contextKeys; i++) {
            const keyContextValueOnData = dataKeys[contextKeys[i]];
            if (keyContextValueOnData !== null) {
                dataKeys[contextKeys[i]] = contextKeys[contextKeys[i]];
            } else if (typeof keyContextValueOnData === 'object') {
                const dataKeysRecursive    = Object.keys(dataKeys[dataKeys[i]]);
                const contextKeysRecursive = Object.keys(keyContextValueOnData);
                dataKeys[contextKeys[i]] = this.#injectContext(dataKeysRecursive, contextKeysRecursive);
            }
        }
        return dataKeys;
    };

    /**
     * Return the 'collection' object of a ContextService instance.
     *
     * @returns {Object} data - Collection data.
     */
    get() {
        return this.#collection;
    };

    /**
     * Return the 'collection' object of a ContextService instance.
     *
     * @returns {Object} data - Collection data.
     */
    clone() {
        return new ContextService(this.#collection);
    };
}

module.exports = { ContextService };