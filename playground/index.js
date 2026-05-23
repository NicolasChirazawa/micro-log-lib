const { LoggerService } = require('../lib/core/logger_service');
const { SanitizerService } = require('../lib/core/sanitizer_service');

class ServicoTeste {
    static #name = "ServicoTeste";

    static testarOperacao() {
        const options = { colorize: true, 'teste': 'legal', outputMode: 'BOTH', type: { 'ERROR': 'RED' } };
        const teste_2 = new LoggerService(options);

        console.log(teste_2.info('Teste', options, ServicoTeste))
    }
};

class ServicoTeste_2 {
    #name = "ServicoTeste_2";
    
    static novaOperacao() {
        let objeto = ['objeto', 'legal', 'bacana'];
        SanitizerService.updateSanitizeFields(objeto);
    }
};

ServicoTeste.testarOperacao();