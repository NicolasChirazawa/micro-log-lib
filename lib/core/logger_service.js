const { NormalizeService } = require('./normalize_service');
const { SanitizerService } = require('./sanitizer_service');
const { UUIDService } = require('./uuid_service');
const { FormatterService } = require('./formatter_service');
const { ContextService } = require('./context_service');

/**
 * Provides utilities for structured and configurable logging.
 * Supports:
 * - log levels
 * - ANSI color formatting
 * - JSON output
 * - sensitive data sanitization
 * @class
 */
class LoggerService {

    /**
     * Internal validation map used to validate logger options.
     *
     * @type {Readonly<Record<string, Array<string | boolean>>>}
     */
    static #valid = Object.freeze({
        type:       ['FATAL', 'ERROR', 'WARN', 'DEBUG', 'INFO'],
        outputMode: ['LOG', 'JSON', 'BOTH'],
        colorize:   [false, true],
        colors:     ['RESET', 'RED', 'GREEN', 'YELLOW', 'BLUE', 'WHITE']
    });

    /**
     * ANSI color escape sequences used for terminal formatting.
     *
     * @type {Readonly<Record<string, string>>}
     */
    static #colors = Object.freeze({
        RESET:  '\u001b[0m',
        RED:    '\u001b[31m',
        GREEN:  '\u001b[32m',
        YELLOW: '\u001b[33m',
        BLUE:   '\u001b[34m',
        WHITE:  '\u001b[37m',
    });

    /**
     * Logger configuration.
     *
     * @type {{
     *   colorize: boolean,
     *   outputMode: 'LOG' | 'JSON' | 'BOTH',
     *   type: Record<string, string>
     * }}
     */
    #config = {
        colorize: false,
        outputMode: 'BOTH',
        type: {
            FATAL: 'WHITE',
            ERROR: 'WHITE',
            WARN:  'WHITE',
            DEBUG: 'WHITE',
            INFO:  'WHITE',
        }
    };

    /**
     * Creates a new logger instance.
     *
     * @param {Class}  [SanitizerService={}] - 'SanitizerService' configuration options.
     * @param {Class}  [FormatterService={}] - 'FormatterService' configuration options.
     * @param {Object} [options={}]          - 'LoggerService' configuration options.
     */
    constructor({
        sanitizer = new SanitizerService(),
        formatter = new FormatterService(),
        context   = new ContextService(),
        options   = {},
    } = {}) {
        this.#validateInstance(options);

        const merged = {
            ...this.#config,
            ...options,
            type: {
                ...this.#config.type,
                ...options.type
            }
        };
        
        this.sanitizer = sanitizer;
        this.formatter = formatter;
        this.context   = context; 
        this.#config   = merged;
    }

    /**
     * Validates logger configuration instance.
     *
     * @param {Object} options - Logger configuration object.
     * @throws {Error} Thrown when an invalid option is provided.
     * @returns {void}
     */
    #validateInstance(options) {
        const keysOptions = Object.keys(options);

        for (const keyOption of keysOptions) {
            if (this.#config[keyOption] === undefined) {
                delete options[keyOption];
                continue;
            }

            if (keyOption === 'type') {
                const typesOptions   = Object.keys(options[keyOption]);
                const typesArrayData = Object.keys(this.#config[keyOption]);

                for (const typeOption of typesOptions) {
                    const found = typesArrayData.find(
                        (element) => element === typeOption
                    );

                    if (!found) {
                        throw new Error(
                            `Invalid option for '${keyOption}'. ` +
                            `Expected one of: [${typesArrayData.join(', ')}]`
                        );
                    }
                }

                const colorsOptions   = Object.values(options[keyOption]);
                const colorsArrayData = Object.keys(LoggerService.#colors);

                for (const colorOptions of colorsOptions) {
                    const found = colorsArrayData.find(
                        (element) => element === colorOptions
                    );

                    if (!found) {
                        throw new Error(
                            `Invalid color value '${colorOptions}'. ` +
                            `Expected one of: [${colorsArrayData.join(', ')}]`
                        );
                    }
                }

                continue;
            }

            const validArrayData = LoggerService.#valid[keyOption];
            

            let found = false;
            for (let i = 0; validArrayData.length; i++) {
                if (validArrayData[i] === options[keyOption]) {
                    found = true;
                    break;
                }
            };

            if (!found) {
                throw new Error(
                    `Invalid option for '${keyOption}'. ` +
                    `Expected one of: [${validArrayData.join(', ')}]`
                );
            }
        }
    }

    /**
     * Creates a DEBUG log entry.
     * @param {String} message - Message text of log
     * @param {Object} fields  - { data, serviceName, uuid, any extra fields }
     * @returns {Object|string|undefined}
     */
    debug(message, fields) {
        return this.#log('DEBUG', message, fields);
    }

    /**
     * Creates an INFO log entry.
     * @param {String} message - Message text of log
     * @param {Object} fields  - { data, serviceName, uuid, any extra fields }
     * @returns {Object|string|undefined}
     */

    // { message, data, serviceName, uuid }, extraFields
    info(message, fields) {
        return this.#log('INFO', message, fields);
    }

    /**
     * Creates a WARN log entry.
     * @param {String} message - Message text of log
     * @param {Object} fields  - { data, serviceName, uuid, any extra fields }
     * @returns {Object|string|undefined}
     */
    warn(message, fields) {
        return this.#log('WARN', message, fields);
    }

    /**
     * Creates an ERROR log entry.
     * @param {String} message - Message text of log
     * @param {Object} fields  - { data, serviceName, uuid, any extra fields }
     * @returns {Object|string|undefined}
     */
    error(message, fields) {
        return this.#log('ERROR', message, fields);
    }

    /**
     * Creates an FATAL log entry.
     * @param {String} message - Message text of log
     * @param {Object} fields  - { data, serviceName, uuid, any extra fields }
     * @returns {Object|string|undefined}
     */
    fatal(message, fields) {
        return this.#log('FATAL', message, fields);
    }

    /**
     * Creates and processes a log entry.
     *
     * Automatically:
     * - normalizes log levels
     * - sanitizes sensitive data
     * - generates UUIDs
     * - formats timestamps
     *
     * @param {'ERROR' | 'WARN' | 'DEBUG' | 'INFO'} type - Log level.
     * @param {string} message - Log message.
     * @param {Object|undefined} [data=undefined] - Additional log metadata.
     *
     * @returns {Object|string|undefined}
     * Returns:
     * - structured log object when outputMode includes JSON
     * - UUID string when outputMode is LOG
     * - undefined when log type is invalid
     */
    #log(type, message, fields = undefined) {
        type = NormalizeService.upper(type);
        this.#validate(type, message, fields);

        const data = this.context.inject(fields);
        
        let uuid;
        if (!data?.uuid) uuid = UUIDService.generate();

        const processedData = {
            id: uuid,
            type,
            message,
            ...data,
            timestamp: new Date().toISOString(),
        };

        const logData = this.#output(
            processedData,
            this.#config.outputMode
        );

        return logData || uuid;
    };

    /**
     * Validates logger method.
     *
     * @param {Object} type - Logger type.
     * @param {Object|undefined} message - Logger configuration object.
     * @param {Object|undefined} fields - Logger configuration object.
     * 
     * @throws {Error} Thrown when an invalid option is provided.
     */
    #validate(type, message, fields) {
        const errorList = [];
        if (!LoggerService.#valid.type.includes(type)) {
            errorList.push(
                'Invalid option "type \n' +
                `Option choosed: "${type}"`
            )
        };
        if (typeof message !== 'string' && message !== undefined) { 
            errorList.push('"Message" must be an string');
        };
        if (typeof fields !== 'object' && fields !== undefined) { 
            errorList.push('"Fields" must be an object');
        };
        if (errorList.length > 0) {
            const errorMessage = '\n{\n' + errorList.join('\n') + '\n}';
            throw new Error(errorMessage)
        };
        return;
    }

    /**
     * Outputs log data based on the configured output mode.
     *
     * @param {Object} data - Processed log data.
     * @param {'LOG' | 'JSON' | 'BOTH'} outputMethod - Output strategy.
     * @throws {TypeError} Thrown when the provided data is not a object or null.
     * @returns {Object|undefined}
     */
    #output(data, outputMethod) {
        if (data?.data) {
            let sanitizedData = structuredClone(data.data);
            sanitizedData = this.sanitizer.sanitize(sanitizedData);
            data.data = sanitizedData;
        }

        if (outputMethod === 'LOG' || outputMethod === 'BOTH') {
            const isColorUsed = this.#config.colorize;

            const start_color = isColorUsed
                ? LoggerService.#colors[this.#config.type[data.type]]
                : '';

            const end_color = isColorUsed
                ? LoggerService.#colors.RESET
                : '';
            
            const formatted_text = this.formatter.transformTemplateToLog(data);
            console.log(`${start_color}${formatted_text}${end_color}`);
        }

        if (outputMethod === 'JSON' || outputMethod === 'BOTH') return data;
        return;
    }

    /**
     * Invocate a function helper to simplify a LoggerService class.
     *
     * @param {Object|null} [data=null] data - Data on context
     * @throws {TypeError} Thrown when the provided data is not a object or null. 
     * @param {String} [service_name=''] service_name - Service name
     * @param {Object} context - Context on class
     */
    child(fields) {
        if (fields === undefined || typeof fields !== 'object') {
            throw new Error('Child needs to be an "object');
        }
        fields.serviceName =
            fields?.serviceName ? fields.serviceName : 'UNKNOWN SERVICE';

        const sanitizer = this.sanitizer.clone();
        const formatter = this.formatter.clone();
        const context   = this.context.clone();
        const options   = structuredClone(this.#config);

        const loggerChild = new LoggerService(
            {
                sanitizer, 
                formatter, 
                context,
                options,
            }
        );

        loggerChild.context.create(fields);
        return loggerChild;
    };
}

module.exports = { LoggerService }