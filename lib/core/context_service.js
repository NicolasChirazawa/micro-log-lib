/**
 * Accumulate the context of father logs.
 * @class
 */
class ContextService {
    /**
     * @type {Object} - Collection data
     */
    #collection; // For now, context can only support 'data' and 'serviceName'
    constructor() {
        this.#collection = {};
    }

    /**
     * Create a context into the instance class.
     *
     * @param {Object} data - Data on context
     * @param {String} service_name - Service name
     * @param {Object} context - Context on class
     */
    create(data, serviceName, context) {
        this.#validateCreateContext({data, serviceName, context});
        this.#collection = {
            data: {
                ...context?.data,
                ...data,
            },
            serviceName: serviceName,
        }
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
    #validateCreateContext({data, serviceName, context}) {
        let errorList = [];

        if (typeof data !== 'object' && data !== null) {
            const error = '"data" has to be an object';
            errorList.push(error);
        };
        if (!serviceName || typeof serviceName !== 'string') {
            const error = '"serviceName" has to be an string';
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
    inject(data, serviceName) {
        let [contextData, contextService] = [data, serviceName];
        if (this.#collection?.data) {
            contextData = {
                ...this.#collection.data,
                ...data,
            };
        }

        if (serviceName) {
            contextService = serviceName;
        } else if (this.#collection?.serviceName) {
            contextService = this.#collection?.serviceName;
        } else {
            contextService = 'UNKNOWN SERVICE';
        }

        return { contextData, contextService };
    };

    /**
     * Return the 'collection' object of a ContextService instance.
     *
     * @returns {Object} data - Collection data.
     */
    get() {
        return this.#collection;
    };
}

module.exports = { ContextService };