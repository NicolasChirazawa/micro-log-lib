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
    inject(data) {
        const contextCollection = this.collection;
        if(contextCollection === undefined) return data;

        const contextKeys = Object.keys(contextCollection);
        if (contextKeys.length === 0) return data;

        const dataKeys = Object.keys(data);
        
        const contextData = this.#injectContext(data, dataKeys, contextCollection, contextKeys);

        // Verificar para utilizar o 'validate'
        if (typeof contextData !== 'object' && contextData !== null) { 
            throw new TypeError('"Data" must be an object');
        };

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
     * Return the 'collection' parameter of a 'ContextService' instance.
     *
     * @returns {Object} data - Collection data.
     */
    get collection() {
        if (this.#collection !== undefined) {
            return this.#collection;
        }
        return undefined;
    };

    /**
     * Return the collection parameter of a 'ContextService' instance.
     *
     * @returns {Object} data - Collection data.
     */
    clone() {
        return new ContextService(this.#collection);
    };
}

module.exports = { ContextService };