const assert = require('node:assert');
const { test, describe, it } = require('node:test');

const { ContextService } = require('../../lib/core/context_service');

describe('ContextService Class', async () => {  
    
    let invalidType = (e) => String(e).toUpperCase();
    const invalidInput = {
        data: invalidType,
        context: 12,
    }

    const validInput = {
        data: {
            "valor": 12,
            "resposta": 13,
        },
        serviceName: "ServicoTeste",
    }

    const validInput_2 = {
        data: {
            "resposta": 14,
            "verificacao": 15,
        },
        serviceName: "ServicoTeste",
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

            contextService.create(validInput);
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

            contextService.create(validInput);
            contextService.create(validInput_2)
            const output = contextService.get();
            
            assert.deepEqual(
                answer,
                output,
            );
        });
    });

    await it('"inject" method', async () => {
        await test('Standart injection', () => {            
            const context = new ContextService();
            context.create(validInput);

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

            const contextData = 
                context.inject(validInput_3);

            assert.deepEqual(contextData.data,        answerData)
            assert.deepEqual(contextData.serviceName, validInput_3.serviceName);
        });  
        await test('Standart injection + without serviceName in injection', () => {            
            const context = new ContextService();
            context.create(validInput);

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

            const contextData = 
                context.inject(validInput_3);

            assert.deepEqual(contextData.data,        answerData)
            assert.deepEqual(contextData.serviceName, validInput.serviceName);
        });  
    });
});
