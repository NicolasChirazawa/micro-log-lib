class FormatterService {
    static #format = '[${timestamp}] [${id}] [${type} - ${service}] ${message}';
    
    static set format(text) {
        return this.#format = text;
    }

    static transformFormat(body) {
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
                    log += String(this.#transformInVariable(body, accumulation));
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

    static #transformInVariable(body, object_value_text) {
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