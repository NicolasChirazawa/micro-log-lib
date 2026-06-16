const assert = require('node:assert');
const { test, describe, it } = require('node:test');

const { ContextService } = require('../../lib/core/context_service');

describe('ContextService Class', async () => {  
    
    let invalidType = (e) => String(e).toUpperCase();
    const invalidInput = {
        data: invalidType,
        serviceName: undefined,
        context: 12,
    }

    const validInput = {
        data: {
            "valor": 12,
            "resposta": 13,
        },
        serviceName: "ServicoTeste",
        context: {},
    }

    const validInput_2 = {
        data: {
            "resposta": 14,
            "verificacao": 15,
        },
        serviceName: "ServicoTeste",
        context: {},
    }

    await it('"create" method', async () => {
        await test('Create a valid context', () => {            
            const contextService = new ContextService();

            const answer = {
                data: {
                    "valor": 12,
                    "resposta": 13,
                },
                serviceName: "ServicoTeste",
            }

            contextService.create(validInput.data, validInput.serviceName, validInput.context);
            const output = contextService.get();
            
            assert.deepEqual(
                answer,
                output,
            );
        });

        await test('Accumulate context using two inputs', () => {            
            const contextService = new ContextService();

            const context = {
                data: {
                    "valor": 12,
                    "resposta": 13,
                },
                serviceName: "ServicoTeste",
            }
            const answer = {
                data: {
                    "valor": 12,
                    "resposta": 14,
                    "verificacao": 15,
                },
                serviceName: "ServicoTeste",
            };

            contextService.create(validInput.data, validInput.serviceName, validInput.context);
            contextService.create(validInput_2.data, validInput_2.serviceName, context)
            const output = contextService.get();
            
            assert.deepEqual(
                answer,
                output,
            );
        });

        await test('Create an invalid context', () => {            
            assert.throws(() => {
                new ContextService().create(invalidInput.data, invalidInput.serviceName, invalidInput.context)
            },  TypeError );
        });
    });

    await it('"inject" method', async () => {
        await test('Standart injection', () => {            
            const context = new ContextService();
            context.create(validInput.data, validInput.serviceName, validInput.context);

            const validInput_3 = {
                data: {
                    "amago": 19,
                },
                serviceName: 'BancoService'
            }
            const answerData = { 
                "amago": 19, 
                "valor": 12,
                "resposta": 13, 
            }

            const { contextData, contextService } = 
                context.inject(validInput_3.data, validInput_3.serviceName)

            assert.deepEqual(contextData,    answerData)
            assert.deepEqual(contextService, validInput_3.serviceName);
        });  
        await test('Standart injection + without serviceName in injection', () => {            
            const context = new ContextService();
            context.create(validInput.data, validInput.serviceName, validInput.context);

            const validInput_3 = {
                data: {
                    "amago": 19,
                },
            }
            const answerData = { 
                "amago": 19, 
                "valor": 12,
                "resposta": 13, 
            }

            const { contextData, contextService } = 
                context.inject(validInput_3.data, validInput_3.serviceName)

            assert.deepEqual(contextData,    answerData)
            assert.deepEqual(contextService, validInput.serviceName);
        });  
    });

    await it('"get" method', async () => {
        await test('Get collection data', () => {            
            const contextService = new ContextService();

            const answer = {
                data: {
                    "valor": 12,
                    "resposta": 13,
                },
                serviceName: "ServicoTeste",
            }

            contextService.create(validInput.data, validInput.serviceName, validInput.context);
            const output = contextService.get();
            
            assert.deepEqual(
                answer,
                output,
            );
        });  
    });
});
