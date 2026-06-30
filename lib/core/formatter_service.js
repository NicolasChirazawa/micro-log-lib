/**
 * Responsible for formatting the logs.
 * @class
 */
class FormatterService {
    /**
     * Template for logs.
     *
     * @type {string} - format
     */
    #formatField;
    
    constructor(formatField) {
        const standartFormatField = '[${timestamp}] [${id}] [${type} - ${service}] ${message}';

        this.#formatField = 
            formatField ? formatField : standartFormatField;
    }

    /**
     * Set a template as a format to the logs.
     *
     * @param {string} template - Template text.
     */
    set format(template) {
        if (typeof template !== "string") {
            throw new TypeError("Format field needs to be a string");
        }

        this.#formatField = template;
    }

    /**
     * Get the instant #format of 'FormatterService'.
     *
     * @return {string}
     */
    get format() {
        return this.#formatField;
    }

    /**
     * Process the template #format to an log string with object 
     * values replaced.
     *
     * @param {Record<string, any>} body - Log object 
     * @return {string}
     */
    transformTemplateToLog(body) {
        const format = this.#formatField;

        let [log, accumulation, isValidFormat] = ['', '', false];

        for (let i = 0; i < format.length; i++) {
            if (
                format[i] === '$' && accumulation === ''
                ||
                format[i] === '{' && accumulation === '$'
                ||
                isValidFormat === true
            ) {
                accumulation += format[i];

                if (accumulation === '${') {
                    isValidFormat = true;
                } else if (format[i] === '}') { 
                    log += String(this.#getValueFromPath(body, accumulation));
                    accumulation = '';
                    isValidFormat = false;
                };
            } else {
                log += accumulation;
                accumulation = '';

                log += format[i];
            }
        }
        return log;
    }

    /**
     * Process the template #format to an log string with object 
     * values replaced.
     *
     * @param {Record<string, any>} body - Log object 
     * @param {string>} object_value_text - Object text syntax
     * @return {string|undefined} 
     */
    #getValueFromPath(body, object_value_text) {
        const cleanNameObject = object_value_text.slice(2, object_value_text.length - 1);
        const arrayObjectValues = cleanNameObject.split('.');

        let value = body;
        
        for (let i = 0; i < arrayObjectValues.length; i++) {
            if (value === undefined) return undefined;
            value = value[arrayObjectValues[i]];
        };

        return value;
    }

    clone() {
        return new FormatterService(this.#formatField);
    }
}

module.exports = { FormatterService }