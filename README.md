<h1 align="center">micro-log-lib</h1>

<p align="center">
  <img src="https://img.shields.io/static/v1?label=%20&labelColor=fffdaf&message=Javascript&color=grey&style=for-the-badge&logo=javascript&logoColor=black"/>
  <img src="https://img.shields.io/static/v1?label=%20&labelColor=d1ffbd&message=Node.JS&color=grey&style=for-the-badge&logo=node.js&logoColor=black"/>
</p>

<p align="center">
  Biblioteca de logging leve, configurável e pronta para produção.<br/>
  Projetada para aplicações de qualquer nível de maturidade.
</p>

<p align="center">
  <a href="#instalacao">Instalação</a> •
  <a href="#funcionalidades">Funcionalidades</a> •
  <a href="#primeiros-passos">Primeiros passos</a> •
  <a href="#configuracao">Configuração</a> •
  <a href="#como-usar">Como usar?</a>
</p>

---

<h2 name="instalacao">Instalação</h2>

```bash
npm install micro-log-lib
```

---

<h2 name="funcionalidades">Funcionalidades</h2>

- **Níveis de log** — `debug`, `info`, `warn`, `error` e `fatal`;
- **Output flexível** — `LOG`, `JSON` e `BOTH`;
- **Código limpo** — evocação de `child` para atributos comuns entre logs;
- **Sanitização automática** — ocultação de dados sensíveis;
- **Rastreabilidade** — geração automática de UUID;
- **Configuração por instância** — diferentes comportamentos por contexto ao `LoggerService`;
- **Formatação de logs personalizada** — template de logs personalizável;

---

<h2 name="primeiros-passos">Primeiros passos</h2>

```js
const { LoggerService } = require('micro-log-lib');

LoggerService.child(
  { user_id: '12342334' },
  'ProcessService'
);

// LoggerService.{level}(message, data?)

LoggerService.info(
  'Usuário autenticado',
  { userId: 'abc123' }
);

LoggerService.debug(
  'Iniciando conexão',
  { host: 'localhost' }
);

LoggerService.warn(
  'Rate limit próximo do limite',
  { remaining: 5 }
);

LoggerService.error(
  'Falha ao processar pagamento',
  { code: 500 }
);

LoggerService.fatal(
  'Estouro de limite de memória',
  { code: 500 }
);
```

---

<h2 name="configuracao">Configuração</h2>

Também é possível realizar diversas configurações de instanciação conforme o seu interesse, que atuam em diversos elementos:

- options;
- sanitizer;
- formatter;
- contextualizer;

---

### Options

O `Options` aplica configurações sobre o funcionamento do ``LoggerService``.

<details>
<summary>Atributos:</summary>

| Opção | Tipo | Descrição |
|---|---|---|
| `colorize` | `boolean` | Habilita cores no output do terminal |
| `outputMode` | `'LOG' \| 'JSON' \| 'BOTH'` | Define o formato de saída dos logs |
| `type` | `Record<string, string>` | Cor por nível de log |

<details>
<summary>Como funciona o 'output':</summary>

### LOG

A devolução é via console.log().
```txt
[INFO] [AuthService] Usuário autenticado
```

### JSON

A devolução é via valor:
```json
{
  "uuid": "cf35f8e0dbf4813a5259",
  "timestamp": "2026-05-25T22:14:10.120Z",
  "level": "INFO",
  "message": "Usuário autenticado",
  "service": "AuthService"
}
```

</details>
</details>

<details>
<summary>Exemplo de implementação:</summary>

```js
const options = {
  colorize: true,
  outputMode: 'BOTH',
  type: {
    LETAL: 'YELLOW',
    ERROR: 'RED',
    WARN: 'YELLOW',
    INFO: 'BLUE',
    DEBUG: 'GREEN'
  },
};

const logger = new LoggerService({ options });
```

</details>

---

### Sanitizer

O `Sanitizer` aplica configurações sobre o `SanitizerService`.

<details>
<summary>Atributos</summary>

| Opção | Tipo | Descrição |
|---|---|---|
| `sanitizeFields` | `string[]` | Campos que devem ser sanitizados |
| `redactValue` | `string` | Texto substituto dos campos sanitizados |

</details>

<details>
<summary>Exemplo de implementação:</summary>

```js
const { LoggerService } = require('micro-log-lib');
const { SanitizerService } = require('micro-log-lib');

const sanitizeValue = '[REDACTED]';
const sanitizeFields = [
  'access-token',
  'refresh-token',
  'password'
];

const sanitizer =  new SanitizerService(sanitizeValue, sanitizeFields);
const logger = new LoggerService({sanitizer});
);
```

</details>

---

### Formatter

O `Formatter` aplica configurações sobre o `FormatterService`.

<details>
<summary>Atributos</summary>

| Opção | Tipo | Descrição |
|---|---|---|
| `format` | `string` | Template em texto para ser usado pelo log |

</details>

<details>
<summary>Exemplo de implementação</summary>

```js
const { LoggerService } = require('micro-log-lib');
const { FormatterService } = require('micro-log-lib');

const template = '[${timestamp}] [${id}] [${type} - ${service}] ${message}';
const formatter = new FormatterService(template);

const logger = new LoggerService({formatter})
```

</details>

---

### Contextualizer

O `Contextualizer` aplica configurações sobre o `ContextualizerService`.

<details>
<summary>Atributos</summary>

| Opção | Tipo | Descrição |
|---|---|---|
| `collection` | `Object` | Objeto de contexto a ser injetado |

</details>

<details>
<summary>Exemplo de implementação</summary>

```js
const { LoggerService }         = require('micro-log-lib');
const { ContextualizerService } = require('micro-log-lib');

const context = { serviceName: 'TesteServico }';
const contextualizer = new ContextualizerService(context);

const logger = new LoggerService({contextualizer})
```

</details>

<h2 name="documentacao">Como usar?</h2>

### LoggerService

Responsável pela geração de loggers estruturados.

<details>
<summary>Documentação de atributos e métodos</summary>

### Atributo(s)

- `config`
   - Campo de configuração da instância da classe `LoggerService`

### Método(s)

#### constructor()

Instância para gerar uma nova configuração do `LoggerService`.

```ts
constructor({
        sanitizer      = new SanitizerService(),
        formatter      = new FormatterService(),
        contextualizer = new ContextualizerService(),
        options        = {},
    } = {}) {
        //[...]
    }
```

---

#### debug()

Usado para receber diagnósticos detalhados sobre o sistema à desenvolvedores dentro do ambiente de teste.

Casos comuns:
- Valor de variável; 
- Fluxo detalhado;

Exemplo: ("SELECT 23+ users from database", users);

```ts
debug() {
  return this.debug('DEBUG', message, data, service_name, uuid);
}
```

---

#### info()

Eventos gerais do sistema, uma confirmação se o sistema funciona corretamente

Casos comuns:
- Inicialização de serviços;
- Conclusão de serviços;

Exemplo: ("User login successful:", username)

```ts
info() {
  return this.info('INFO', message, data, service_name, uuid);
}
```

---

#### warn()

Situação inesperada mas que não interrompe um fluxo, entretanto, requerem atenção 

Casos comuns:
- Pouco espaço no disco;
- Uso de CPU muito alto;

Exemplo: ("CPU has achivied 85% of memory")

```ts
warn() {
  return this.warn('WARN', message, data, service_name, uuid);
}
```

---

#### error()

Interrompimento do fluxo de uma operação.

- Operação com erro; 
- Ausência de dados;

Exemplo: ("User not found on DB")

```ts
error() {
  return this.warn('WARN', message, data, service_name, uuid);
}
```

---

#### fatal()

Erro que leva ao encerramento da aplicação.

- Erro não tratado; 
- Uso de CPU estourou;

Exemplo: ("Memory usage exceeds max")

```ts
fatal() {
  return this.warn('FATAL', message, data, service_name, uuid);
}
```
 
 #### child()

'Helper' responsável para simplificar a chamada de loggers.

- Simplifica a verborragia do código;

```ts
child() {
  return this.child();
}
```

</details>

### SanitizerService

Responsável pela sanitização dos dados dos logs.

<details>
<summary>Documentação de atributos e métodos</summary>

### Atributo(s)

- `sanitizeFields`
  - Objeto que possui os campos a serem sanitizados

- `redactValue`
  - Valor substituto utilizado na sanitização

### Método(s)

#### addSanitizeFields()

Adiciona campos personalizados que também devem ser sanitizados.

```ts
updateSanitizeFields(option: string[]): void {
  // [...]
  SanitizerService.#sanitizeFields = merge;
}
```

Input:
[
  'password',
  'access-token',
  'refresh-token'
]

---

#### updateRedactValue()

Atualiza o valor utilizado para substituir os campos sensíveis.


```ts
updateRedactValue(text: string): void {
  // [...]
  SanitizerService.redactValue = value;
}
```

Input: '[SENSITIVE DATA]'

---

#### sanitize()

Responsável pela sanitização dos dados dos logs.

Características:

- Sanitização baseada nas chaves do objeto;
- As chaves são case insensitive;
- Sanitização compatível com múltiplos níveis de profundidade construído com recursivdade;

```ts
sanitize(data) {
  let keys = Object.keys(data);
  // [...]
  return data;
}
```

Input:

```json
{
  "email": "teste@gmail.com",
  "password": "123456789",
  "data": {
    "phone": "1234-5678"
  }
}
```

Output:

```json
{
  "email": "teste@gmail.com",
  "password": "[SENSITIVE DATA]",
  "data": {
    "phone": "[SENSITIVE DATA]"
  }
}
```

##### *Supondo que os campos do sanitizer fields são: 'password' e 'phone'

</details>

### FormatterService

Responsável pela formatação personalizada dos logs.

<details>
<summary>Documentação de atributos e métodos</summary>

### Atributo(s)

- `format`
  - Formatação personalizada do log;

### Método(s)

#### set format()

Estrutura um novo template ao format.

```ts
set format(template) {
    this.#format = template;
}
```

Input: '[${timestamp}] [${id}] [${type} - ${service}] ${message}';

---

#### get format()

Recupera o valor atual do #format no 'FormatterService'.

```ts
get format() {
    return this.#format;
}
```

Output: '[${timestamp}] [${id}] [${type} - ${service}] ${message}';

---

#### transformTemplateToLog()

Baseado no objeto do log, utiliza-se do template para gerar a mensagem personalizada do log.

Características:
- Transformação do template em um log com valores reais;

```ts
transformTemplateToLog(body) {
    const format = this.#format;
    // [...]
    return log;
}
```

Input:

```json
{
  "type": "FATAL",
  "message": "teste",
  "data": {
    "nome": "falar"
  },
  "service": "ServicoTeste"
}
```

Output:

```bash
[2026-05-28T02:49:34.012Z] [e5f1510eaf3b45e2b7d3] [FATAL - ServicoTeste] teste
```

</details>

