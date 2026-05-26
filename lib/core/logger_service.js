const { NormalizeService } = require('./normalize_service');
const { SanitizerService } = require('./sanitizer_service');
const { UUIDService } = require('./uuid_service');

/**
 * Provides utilities for structured and configurable logging.
 * Supports:
 * - log levels
 * - ANSI color formatting
 * - JSON output
 * - sensitive data sanitization
 */
class LoggerService {

    /**
     * Internal validation map used to validate logger options.
     *
     * @type {Readonly<Record<string, Array<string | boolean>>>}
     */
    static #valid = Object.freeze({
        type:       ['ERROR', 'WARN', 'DEBUG', 'INFO'],
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
            ERROR: 'WHITE',
            WARN:  'WHITE',
            DEBUG: 'WHITE',
            INFO:  'WHITE',
        }
    };

    /**
     * Creates a new logger instance.
     *
     * @param {Object} [options={}] - Logger configuration options.
     */
    constructor(options = {}) {
        this.#validate(options);

        const merged = {
            ...this.#config,
            ...options,
            type: {
                ...this.#config.type,
                ...options.type
            }
        };

        this.#config = merged;
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
            console.warn('[WARN - LoggerService]: Invalid Type');
            return;
        }

        const serviceName =
            service?.name ? service.name : 'UNKNOWN SERVICE';

        let sanitizedData;

        if (data) {
            sanitizedData = structuredClone(data);
            sanitizedData = SanitizerService.sanitize(sanitizedData);
        }

        if (!uuid) {
            uuid = UUIDService.generate();
        }

        const processedData = {
            id: uuid,
            type,
            message,
            data: sanitizedData || null,
            service: serviceName,
            timestamp: new Date().toISOString(),
        };

        const logData = this.#output(
            processedData,
            this.#config.outputMode
        );

        return logData || uuid;
    }

    /**
     * Creates a DEBUG log entry.
     *
     * @returns {Object|string|undefined}
     */
    debug(message, data, service, uuid) {
        return this.#log('DEBUG', message, data, service, uuid);
    }

    /**
     * Creates an INFO log entry.
     *
     * @returns {Object|string|undefined}
     */
    info(message, data, service, uuid) {
        return this.#log('INFO', message, data, service, uuid);
    }

    /**
     * Creates a WARN log entry.
     *
     * @returns {Object|string|undefined}
     */
    warn(message, data, service, uuid) {
        return this.#log('WARN', message, data, service, uuid);
    }

    /**
     * Creates an ERROR log entry.
     *
     * @returns {Object|string|undefined}
     */
    error(message, data, service, uuid) {
        return this.#log('ERROR', message, data, service, uuid);
    }

    /**
     * Creates an CRITICAL log entry.
     *
     * @returns {Object|string|undefined}
     */
    critical(message, data, service, uuid) {
        return this.#log('CRITICAL', message, data, service, uuid);
    }

    /**
     * Outputs log data based on the configured output mode.
     *
     * @param {Object} data - Processed log data.
     * @param {'LOG' | 'JSON' | 'BOTH'} outputMethod - Output strategy.
     *
     * @returns {Object|undefined}
     */
    #output(data, outputMethod) {
        if (outputMethod === 'LOG' || outputMethod === 'BOTH') {
            const isColorUsed = this.#config.colorize;

            const start_color = isColorUsed
                ? LoggerService.#colors[this.#config.type[data.type]]
                : '';

            const end_color = isColorUsed
                ? LoggerService.#colors.RESET
                : '';

            console.log(
                `${start_color}[${data.id}] ` +
                `[${data.type} - ${data.service}]: ` +
                `${data.message}${end_color}`
            );
        }

        if (outputMethod === 'JSON' || outputMethod === 'BOTH') {
            return data;
        }
        return;
    }
}

module.exports = { LoggerService }