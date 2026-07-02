/**
 * Accumulate the context of father logs.
 * @class
 */
class ContextualizerService {
    /**
     * @type {Object} - Collection data
     */
    #collection;

    constructor(collection) {
        this.#collection = collection;
        this.#validate(this.#collection);
    }

    /**
     * Update the 'collection' parameter using the 'inject' method.
     *
     * @param {Object} data - Data to be updated with 'context'
     */
    create(data) {
        this.#collection = this.inject(data);
    };

    /**
     * Validate the new instance of 'Context Service'.
     *
     * @param {Object | undefined} data - Data to be updated with 'context'
     * @param {Object | undefined} context - Context on class
     * 
     * @throws {TypeError} Thrown when the push any errorList into the array 
     */
    #validate(data, context) {
        let errorList = [];

        if (typeof data !== 'object' && data !== undefined) {
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
     * @param {Object | null} data - Data to be updated with 'context'
     *      
     * @returns {Object | null} 
     */
    inject(data = {}) {
        const contextCollection = this.#collection;
        if(contextCollection === undefined) return data;

        const contextKeys = Object.keys(contextCollection);
        if (contextKeys.length === 0) return data;

        const dataKeys = Object.keys(data);

        let contextData = this.#injectContext(data, dataKeys, contextCollection, contextKeys);
        this.#validate(contextData);

        return contextData;
    };

    /**
     * Use the context of the class to merge with the class attribute.
     *
     * @param {Object} dataKeys
     * @param {Object} contextKeys
     */
    #injectContext(dataCollection, dataKeys, contextCollection, contextKeys) {
        for (let i = 0; i < contextKeys.length; i++) {
            const keyContextValueOnData = dataCollection[contextKeys[i]];

         if (typeof keyContextValueOnData === 'object') {
                const newDataCollection    = dataCollection[contextKeys[i]];
                const newContextCollection = contextCollection[contextKeys[i]];

                const keysDataRecursive    = Object.keys(newDataCollection);
                const keysContextRecursive = Object.keys(newContextCollection);

                dataCollection[contextKeys[i]] = this.#injectContext(newDataCollection, keysDataRecursive, newContextCollection, keysContextRecursive);
            } else if (keyContextValueOnData === undefined) {
                dataCollection[contextKeys[i]] = contextCollection[contextKeys[i]];
            };
        };
        return dataCollection;
    };

    /**
     * Method exclusive for tests.
     *
     * @returns {Object} collection - Parameter.
     */
    get() {
        return this.#collection;
    };

    /**
     * Return a new instance of the 'ContextService'.
     *
     * @returns {Object} ContextService - New instance of 'ContextService'.
     */
    clone() {
        return new ContextualizerService(this.#collection);
    };
}

module.exports = { ContextualizerService };