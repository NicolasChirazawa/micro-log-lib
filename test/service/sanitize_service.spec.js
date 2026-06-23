const assert = require('node:assert');
const { test, describe, it, beforeEach } = require('node:test');

const { SanitizerService } = require('../../lib/core/sanitizer_service');

describe('SanitizeService Class', async () => {
    let fields = new SanitizerService().getSanitizeFields();
    const standartFields = { 
        password: true, 
        senha: true, 
        token: true, 
    };
    const standartCensorship = '[REDACTED]';

    await beforeEach('Stardart sanitizeFields in tests', () => {
        fields = { ...standartFields };
    });

    await it('"addSanitizeFields" method', async () => {
        await test('Add new field using a "String" into the "SanitizerField"', () => {
           
            const newField = 'campo';
            const newSanitizerService = new SanitizerService();
            newSanitizerService.addSanitizeFields(newField);
            const result = newSanitizerService.getSanitizeFields();

            const output = { ...fields };    
            output[newField] = true;       

            assert.deepEqual(
                result,
                output,
            );
        });

        await test('Add new fields using an "Array" into the "SanitizerField"', () => {
            const newField = ['teste_1', 'teste_2', 'teste_3'];
            const newSanitizerService = new SanitizerService();

            newSanitizerService.addSanitizeFields(newField);
            const result = newSanitizerService.getSanitizeFields();

            const output = { ...fields };
            
            for (let i = 0; i < newField.length; i++) {
                output[newField[i]] = true; 
            };

            assert.deepEqual(
                result,
                output,
            );
        });

        await test('Throw an "TypeError" if the typeof input is different from the mapped ones', () => {
            const newField = 2;

            assert.throws(() => {
                new SanitizerService().addSanitizeFields(newField);
            }, TypeError)
        });

        await test('Throw an "TypeError" if the "Array" has an value different of string', () => {
            const newField = ["valor", 1];

            assert.throws(() => {
                new SanitizerService().addSanitizeFields(newField);
            }, TypeError)
        });
    });

    await it('"getSanitizeFields" method', async () => {
        await test('Get the SanitizeFields', () => {
            const newSanitizerService = new SanitizerService();
            newSanitizerService.resetSanitizeFields();
            const result = newSanitizerService.getSanitizeFields();

            assert.deepEqual(
                result,
                standartFields,
            );
        });
    });

    await it('"resetSanitizeFields" method', async () => {
        await test('Get the standart "SanitizeFields"', () => {
            const newFields = ["valor_1", "valor_2", "valor_3"];
            const newSanitizerService = new SanitizerService();
            
            newSanitizerService.addSanitizeFields(newFields);
            newSanitizerService.resetSanitizeFields();

            const result = newSanitizerService.getSanitizeFields();

            assert.deepEqual(
                result,
                standartFields,
            );
        });
    });

    await it('"updateRedactValue" method', async () => {
        await test('Update the "redact value" field', () => {
            const output = "*Censurado*";
            const newSanitizerService = new SanitizerService();

            newSanitizerService.updateRedactValue(output);
            const result = newSanitizerService.getRedactValue();

            assert.deepEqual(
                result,
                output,
            );
        });

        await test('Throws "TypeError" when input isnt a string', () => {
            const output = 1234;
            
            assert.throws(() => {
                new SanitizerService().updateRedactValue(output);
            }, TypeError,
            );
        });
    });

    await it('"getRedactValue" method', async () => {
        await test('Get the "redact value" field', () => {            
            const newSanitizerService = new SanitizerService();
            newSanitizerService.updateRedactValue(standartCensorship);
            const result = newSanitizerService.getRedactValue();

            assert.deepEqual(
                result,
                standartCensorship,
            );
        });
    });

    await it('"sanitize" method', async () => {
        await test('Get the object sanitized', () => {    
            const newSanitizerService = new SanitizerService();        
            newSanitizerService.updateRedactValue(standartCensorship)
            
            const object_input = {
                "password": "NomeDiferente123@",
                "pass": true,
                "genre": "M",
                "name": "John Miller",
                "token": "AIWU37G3YG",
            }
                
            const result = newSanitizerService.sanitize(object_input)
            const object_output = {
                "password": standartCensorship,
                "pass": true,
                "genre": "M",
                "name": "John Miller",
                "token": standartCensorship,
            }

            assert.deepEqual(result, object_output);
        });
    });
});
