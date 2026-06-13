const { LoggerService } = require('../lib/core/logger_service');
const { SanitizerService } = require('../lib/core/sanitizer_service');
const { FormatterService } = require('../lib/core/formatter_service');

class ServicoTeste {
    static #name = "ServicoTeste";

    static testar() {
        const options = { 
            colorize: true, 
            'teste': 'legal', 
            outputMode: 'JSON', 
            type: { 
                'FATAL': 'RED' 
            } 
        };

        const logger = new LoggerService({options});
        const logMeta = {
            data: {
                'valor': 2,
            },
            service_name: ServicoTeste.#name
        };        
        const logger_child = logger.child(logMeta);

        const logMeta_2 = {
            data: {
                'token': 3,
            },
            service_name: ServicoTeste.#name
        };
        const logger_child_child = logger_child.child(logMeta_2);
        
        console.log(logger_child_child)

        let valor = logger_child_child.fatal(
            'Teste', 
            { password: 4 } 
        );
        console.log(valor);
    }
};

ServicoTeste.testar();