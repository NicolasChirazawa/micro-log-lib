const assert = require('node:assert');
const { test, describe, it } = require('node:test');

const { FormatterService } = require('../../lib/core/formatter_service');
const { UUIDService } = require('../../lib/core/uuid_service');

describe('FormatterService Class', async () => {
    const standartFormat = '[${timestamp}] [${id}] [${type} - ${service}] ${message}';

    const inputObject = {
        id: UUIDService.generate(),
        type: 'FATAL',
        message: 'Instrução de teste',
        data: {
            "informacao": "A informação a seguir é de teste"
        },
        service: "PurchaseService",
        timestamp: new Date().toISOString(),
    }
    
    await it('set "format" method', async () => {
        await test('Set a new format for the field "format"', () => {
            const newFormat = '[${timestamp}] [${id}] [${type} - ${service}]'
            
            FormatterService.format = newFormat;
            const output = FormatterService.format;

            assert.deepEqual(
                newFormat,
                output,
            );
        });

        await test('Throws an error if template input is different of a string', () => {
            const newFormat = undefined;

            assert.throws(() => {
                FormatterService.format = newFormat
            }, TypeError );
        });
    });

    await it('get "format" method', async () => {
        await test('Get the format field data', () => {
            FormatterService.format = standartFormat;
            const output = FormatterService.format;

            assert.deepEqual(
                standartFormat,
                output,
            );
        });
    });

    await it('"transformTemplateToLog" method', async () => {
        await test('Transform the object data into a log', () => {            
            const response = FormatterService.transformTemplateToLog(inputObject);
            const output = `[${inputObject.timestamp}] [${inputObject.id}] [${inputObject.type} - ${inputObject.service}] ${inputObject.message}`

            assert.deepEqual(
                response,
                output,
            );
        });

        await test('Change the format, put an invalid parameter in data and test', () => {            
            const newFormat = '[${timestamp}] [${id}] [${type} - ${service}] ${data.input.service}';

            FormatterService.format = newFormat;
            const response = FormatterService.transformTemplateToLog(inputObject);
            const output = `[${inputObject.timestamp}] [${inputObject.id}] [${inputObject.type} - ${inputObject.service}] ${inputObject.data?.input?.service}`

            assert.deepEqual(
                response,
                output,
            );
        });
    });
});
