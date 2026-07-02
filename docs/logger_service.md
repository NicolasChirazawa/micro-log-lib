# LoggerService

Responsável pela geração de loggers estruturados.

## Atributos

- `valid`
  - Objeto de validação para configuração da instância da classe do `LoggerService`

- `colors`
  - Objeto com as cores disponíveis para os logs

- `config`
   - Campo de configuração da instância da classe `LoggerService`

## Métodos

### constructor()

Método para evocar uma instância da classe `LoggerService` com a possibilidade de implementar uma nova configuração.

```ts
constructor({
      sanitizer = new SanitizerService(),
      formatter = new FormatterService(),
      contexter = new ContextService(),
      options   = {},
    } = {}) {
    this.validate(options);
    // [...]
    this.context = {}; 
}
```

### Private validate()

Método privado para a validação da configuração gerada para o `LoggerService`.

```ts
#validateInstance(options) {
  const keys_options = Object.keys(options);
  // [...]
}
```

### debug()

Usado para receber diagnósticos detalhados sobre o sistema à desenvolvedores dentro do ambiente de teste.

Casos comuns:
- Valor de variável; 
- Fluxo detalhado;

Exemplo: ("SELECT 23+ users from database", users);

```ts
debug(message, fields) {
  return this.#log('DEBUG', message, fields);
}
```

### info()

Eventos gerais do sistema, uma confirmação se o sistema funciona corretamente

Casos comuns:
- Inicialização de serviços;
- Conclusão de serviços;

Exemplo: ("User login successful:", username)

```ts
info(message, fields) {
  return this.#log('INFO', message, fields);
}
```

### warn()

Situação inesperada mas que não interrompe um fluxo, entretanto, requerem atenção 

Casos comuns:
- Pouco espaço no disco;
- Uso de CPU muito alto;

Exemplo: ("CPU has achivied 85% of memory")

```ts
warn(message, fields) {
  return this.#log('WARN', message, fields);
}
```

### error()

Interrompimento do fluxo de uma operação.

- Operação com erro; 
- Ausência de dados;

Exemplo: ("User not found on DB")

```ts
error(message, fields) {
  return this.#log('ERROR', message, fields);
}
```

### fatal()

Erro que leva ao encerramento da aplicação.

- Erro não tratado; 
- Uso de CPU estourou;

Exemplo: ("Memory usage exceeds max")

```ts
fatal(message, fields) {
  return this.#log('FATAL', message, fields);
}
```

### Private log()

Método privado que centraliza a chamada dos diferentes níveis de logs.

```ts
#log(type, message, fields = null) {
  type = NormalizerService.upper(type);
  // [...]
  return logData || uuid;
}
```

### Private validate()

Método privado para validação de logs.

```ts
#validate(type, message, fields): void {
  const errorList = [];
  // [...]
  return;
}
```

### Private output()

Responsável pelo `output` JSON e console.log() dos logs.

```ts
#output(data, outputMethod) {
  if (outputMethod === 'LOG' || outputMethod === 'BOTH') { /*... */ }
  // [...]
  return;
}
```

### child()

Método responsável pela invocação de um 'LoggerService' herdando dos atributos do seu pai.

- Herda o constructor do 'LoggerService' pai, ou seja, 'sanitizer', 'formatter' etc..
- Cria um contexto para simplificar a evocação de logs com dados comuns entre eles;
- Retorna uma nova instância de classe do 'LoggerService';

```ts
child(fields) {
  serviceName =
      serviceName ? serviceName : 'UNKNOWN SERVICE';
  // [...]
  return loggerChild;
}
```