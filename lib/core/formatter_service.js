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
    static #format = '[${timestamp}] [${id}] [${type} - ${service}] ${message}';
    
    /**
     * Set a template as a format to the logs.
     *
     * @param {string} template - Template text.
     */
    static set format(template) {
        this.#format = template;
    }

    /**
     * Get the instant #format of 'FormatterService'.
     *
     * @return {string}
     */
    static get format() {
        return this.#format;
    }

    /**
     * Process the template #format to an log string with object 
     * values replaced.
     *
     * @param {Record<string, any>} body - Log object 
     * @return {string}
     */
    static transformTemplateToLog(body) {
        const format = this.#format;

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
     * @return {string} 
     */
    static #getValueFromPath(body, object_value_text) {
        const cleanNameObject = object_value_text.slice(2, object_value_text.length - 1);
        const arrayObjectValues = cleanNameObject.split('.');

        let value = body;
        
        for (let i = 0; i < arrayObjectValues.length; i++) {
            value = value[arrayObjectValues[i]];
        };

        return value;
    }
}

module.exports = { FormatterService }