const { NormalizeService } = require('./normalize_service');
const { SanitizerService } = require('./sanitizer_service');
const { UUIDService } = require('./uuid_service');
const { FormatterService } = require('./formatter_service');

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
        sanitizer = SanitizerService,
        formatter = FormatterService,
        options   = {},
    } = {}) {
        this.#validate(options);

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
        this.#config   = merged;
        this.context   = {}; 
    }

    /**
     * Validates logger configuration options.
     *
     * @param {Object} options - Logger configuration object.
     * @throws {Error} Thrown when an invalid option is provided.
     * @returns {void}
     */
    #validate(options) {
        const keys_options = Object.keys(options);

        for (const key_option of keys_options) {
            if (this.#config[key_option] === undefined) {
                delete options[key_option];
                continue;
            }

            if (key_option === 'type') {
                const typesOptions   = Object.keys(options[key_option]);
                const typesArrayData = Object.keys(this.#config[key_option]);

                for (const typeOption of typesOptions) {
                    const found = typesArrayData.find(
                        (element) => element === typeOption
                    );

                    if (!found) {
                        throw new Error(
                            `Invalid option for '${key_option}'. ` +
                            `Expected one of: [${typesArrayData.join(', ')}]`
                        );
                    }
                }

                const colorsOptions   = Object.values(options[key_option]);
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

            const validArrayData = LoggerService.#valid[key_option];

            const found = validArrayData.find(
                (element) => element === options[key_option]
            );

            if (!found) {
                throw new Error(
                    `Invalid option for '${key_option}'. ` +
                    `Expected one of: [${validArrayData.join(', ')}]`
                );
            }
        }
    }

    /**
     * Creates a DEBUG log entry.
     *
     * @returns {Object|string|undefined}
     */
    debug(message, data, service_name, uuid) {
        return this.#log('DEBUG', message, data, service_name, uuid);
    }

    /**
     * Creates an INFO log entry.
     *
     * @returns {Object|string|undefined}
     */
    info(message, data, service_name, uuid) {
        return this.#log('INFO', message, data, service_name, uuid);
    }

    /**
     * Creates a WARN log entry.
     *
     * @returns {Object|string|undefined}
     */
    warn(message, data, service_name, uuid) {
        return this.#log('WARN', message, data, service_name, uuid);
    }

    /**
     * Creates an ERROR log entry.
     *
     * @returns {Object|string|undefined}
     */
    error(message, data, service_name, uuid) {
        return this.#log('ERROR', message, data, service_name, uuid);
    }

    /**
     * Creates an FATAL log entry.
     *
     * @returns {Object|string|undefined}
     */
    fatal(message, data, service_name, uuid) {
        return this.#log('FATAL', message, data, service_name, uuid);
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
     * @param {Object|null} [data=null] - Additional log metadata.
     * @throws {TypeError} Thrown when the provided data is not a object or null.
     * @param {Object|null} [service=null] - Service or class reference.
     * @param {string|null} [uuid=null] - Custom UUID.
     *
     * @returns {Object|string|undefined}
     * Returns:
     * - structured log object when outputMode includes JSON
     * - UUID string when outputMode is LOG
     * - undefined when log type is invalid
     */
    #log(type, message, data = null, service = null, uuid = null) {
        type = NormalizeService.upper(type);
        if (!LoggerService.#valid.type.includes(type)) {
            throw new Error('Invalid option');
            return;
        }

        const { contextData, contextService } = 
            this.#insertContext(data, service);

        if (typeof contextData !== 'object' && contextData !== null) { 
            throw new TypeError('"Data" must be an object');
        };
        if (!uuid) uuid = UUIDService.generate();

        const processedData = {
            id: uuid,
            type,
            message,
            data: contextData,
            service: contextService,
            timestamp: new Date().toISOString(),
        };

        const logData = this.#output(
            processedData,
            this.#config.outputMode
        );

        return logData || uuid;
    };

    /**
     * Use the context of the class to merge with the class attribute.
     *
     * @param {Object | null} data - Data on context
     * @param {String} service_name - Service name
     *      
     * @returns {String} [service_name=''] service_name - Service name
     */
    #insertContext(data, service_name) {
        let [contextData, contextService] = [data, service_name];
        if (this.context?.data) {
            contextData = {
                ...this.context.data,
                ...data,
            };
        }

        if (service_name) {
            contextService = service_name;
        } else if (this.context?.service_name) {
            contextService = this.context?.service_name;
        } else {
            contextService = 'UNKNOWN SERVICE';
        }

        return { contextData, contextService };
    };

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
     * @param {Object | null} [data=null] data - Data on context
     * @throws {TypeError} Thrown when the provided data is not a object or null. 
     * @param {String} [service_name=''] service_name - Service name
     * @param {Object} context - Context on class
     */
    child({ data = null, service_name = '' }) {
        if (typeof data !== 'object' && data !== null) { 
            throw new TypeError('"Data" must be an object') 
        };
    
        const serviceName =
            service_name ? service_name : 'UNKNOWN SERVICE';
        
        const sanitizer = this.sanitizer;
        const formatter = this.formatter;
        const options   = this.#config;

        const loggerChild = new LoggerService(
            {
                sanitizer, 
                formatter, 
                options,
            }
        );

        const context = this.context;
        loggerChild.#createContext(data, serviceName, context);

        return loggerChild;
    };

    /**
     * Create a context into a class.
     *
     * @param {Object | null} data - Data on context
     * @param {String} service_name - Service name
     * @param {Object} context - Context on class
     */
    #createContext(data, service_name, context) {
        this.context = {
            data: {
                ...context?.data,
                ...data,
            },
            service_name: service_name,
        }
    };
}

module.exports = { LoggerService }