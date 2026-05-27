const { LoggerService } = require('../lib/core/logger_service');
const { SanitizerService } = require('../lib/core/sanitizer_service');
const { FormatterService } = require('../lib/core/formatter_service');

class ServicoTeste {
    static #name = "ServicoTeste";

    static testar() {
        const options = { colorize: true, 'teste': 'legal', outputMode: 'LOG', type: { 'FATAL': 'RED' } };
        const teste_2 = new LoggerService(options);

        teste_2.fatal("teste", {nome: "falar"}, ServicoTeste);
    }
};


ServicoTeste.testar();