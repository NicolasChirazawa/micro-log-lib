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
constructor(options = {}) {
    this.validate(options);
    // [...]
    this.#config = merged;
}
```

#### Private validate()

Método privado para a validação da configuração gerada para o `LoggerService`.

```ts
#validate(options) {
  const keys_options = Object.keys(options);
  // [...]
}
```

#### Private log()

Método privado que centraliza a chamada dos diferentes níveis de logs.

```ts
#log(type, message, data = null, service = null, uuid = null) {
  type = NormalizeService.upper(type);
  // [...]
  return logData || uuid;
}
```

#### debug()

Usado para receber diagnósticos detalhados sobre o sistema à desenvolvedores dentro do ambiente de teste.

Casos comuns:
- Valor de variável; 
- Fluxo detalhado;

Exemplo: ("SELECT 23+ users from database", users);

```ts
debug() {
  return this.debug('DEBUG', message, data, service, uuid);
}
```

#### info()

Eventos gerais do sistema, uma confirmação se o sistema funciona corretamente

Casos comuns:
- Inicialização de serviços;
- Conclusão de serviços;

Exemplo: ("User login successful:", username)

```ts
info() {
  return this.info('INFO', message, data, service, uuid);
}
```

#### warn()

Situação inesperada mas que não interrompe um fluxo, entretanto, requerem atenção 

Casos comuns:
- Pouco espaço no disco;
- Uso de CPU muito alto;

Exemplo: ("CPU has achivied 85% of memory")

```ts
warn() {
  return this.warn('WARN', message, data, service, uuid);
}
```

#### error()

Interrompimento do fluxo de uma operação.

- Operação com erro; 
- Ausência de dados;

Exemplo: ("User not found on DB")

```ts
error() {
  return this.warn('WARN', message, data, service, uuid);
}
```

#### fatal()

Erro que leva ao encerramento da aplicação.

- Erro não tratado; 
- Uso de CPU estourou;

Exemplo: ("Memory usage exceeds max")

```ts
fatal() {
  return this.warn('FATAL', message, data, service, uuid);
}
```

#### Private output()

Responsável pelo `output` JSON e console.log() dos logs.

```ts
output(data, outputMethod) {
  if (outputMethod === 'LOG' || outputMethod === 'BOTH') { /*... */ }
  // [...]
  return;
}
```
