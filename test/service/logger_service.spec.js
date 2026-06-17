const assert = require('node:assert');
const { test, describe, it } = require('node:test');

const { LoggerService } = require('../../lib/core/logger_service');

describe('LoggerService Class', async () => {  

    const option = {
        outputMode: 'JSON',
    };

    await it('instance class process', async () => {
        const invalidInput_1 = {
            type: { FATAL: 'RAINBOW' }
        };
        const invalidInput_2 = { outputMode: 'TESTE' };
        const invalidInput_3 = { teste: 'legal' };

        await test('Use a invalid color', () => {            
            assert.throws(() => {
                new LoggerService({options: invalidInput_1});
            }, Error);
        });

         await test('Use a invalid option "key"', () => {   
            const loggerService = new LoggerService({options: invalidInput_3});
            assert.deepEqual(loggerService, new LoggerService());
        });
    });

    await it('"debug/info/warn/error/fatal" method', async () => {
        await test('Valid method', () => {     

            const loggerService = new LoggerService(option);
            const process = loggerService.info('Teste');

            assert.deepEqual(typeof new Date(process.timestamp), 'object');
            assert.deepEqual(typeof process.id, 'string');
            assert.equal(process.type, 'INFO');
            assert.equal(process.service, 'UNKNOWN SERVICE');
            assert.deepEqual(process.message, 'Teste');
        });
    });

    await it('"child" method', async () => {
        await test('Create a child example', () => {     
            
            const data = { test: '123' };
            const logger = new LoggerService();
            const resLogger = logger.info('teste', data);

            const loggerChild = logger.child({data});
            const resLoggerChild = logger.info('teste');

            assert.deepEqual(
                resLogger.data,
                resLoggerChild.data,
            )
        });

        await test('Create a child-child example', () => {     
            const data   = { test: '123' };
            const data_2 = { example: '234' };
            const data_3 = { test: '123', example: '234' };

            const logger    = new LoggerService();
            const resLogger = logger.info('teste', data_3);

            const loggerChild = logger.child({data});
            
            const loggerChildChild = logger.child({data: data_2});
            const resLoggerChildChild = loggerChildChild.info('teste');


            assert.deepEqual(
                resLogger.data,
                resLoggerChildChild.data,
            )
        });
    });
});
