const { LoggerService } = require('../lib/core/logger_service');
const { SanitizerService } = require('../lib/core/sanitizer_service');
const { FormatterService } = require('../lib/core/formatter_service');
const { ContextService } = require('../lib/core/context_service');

class ServicoTeste {
    #name;

    constructor(name) {
        this.#name = name;
    }
    /*
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
            serviceName: ServicoTeste.#name
        };
        const logger_child = logger.child(logMeta);

        const logMeta_2 = {
            data: {
                'token': 3,
            },
            serviceName: ServicoTeste.#name
        };
        const logger_child_child = logger_child.child(logMeta_2);

        let valor = logger_child_child.fatal(
            'Teste', 
            { password: 4 } 
        );
        console.log(valor);
    }

    static testar_2() {
        const LogTeste = new LoggerService();
        LogTeste.info({'teste': 'invalido'}, 'ababa')
    }
    */
};

const contextTeste = new ContextService();
const censorship = {
    token: true,
    password: true,
};
const censorship_2 = {
    password: {
        password_2: true,
    },
};

const censorship_3 = {
    password_2:  true,
};

const censorship_4 = {
    password: {
        password_3: true,
    },
};


// contextTeste.create(censorship)
contextTeste.create(censorship);
contextTeste.create(censorship_2);
contextTeste.create(censorship_3);
contextTeste.create(censorship_4);