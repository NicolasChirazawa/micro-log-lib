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

- **Níveis de log** — `debug`, `info`, `warn` e `error`;
- **Output flexível** — `LOG`, `JSON` ou ambos (`BOTH`);
- **Cores customizáveis** — configuráveis por nível de log;
- **Sanitização automática** — ocultação de dados sensíveis;
- **Rastreabilidade** — geração automática de UUID;
- **Configuração por instância** — diferentes comportamentos por contexto;

---

<h2 name="primeiros-passos">Primeiros passos</h2>

```js
const { LoggerService } = require('micro-log-lib');

// LoggerService.{level}(message, data?, service?)

LoggerService.info(
  'Usuário autenticado',
  { userId: 'abc123' },
  'AuthService'
);

LoggerService.debug(
  'Iniciando conexão',
  { host: 'localhost' },
  'DatabaseService'
);

LoggerService.warn(
  'Rate limit próximo do limite',
  { remaining: 5 },
  'ApiService'
);

LoggerService.error(
  'Falha ao processar pagamento',
  { code: 500 },
  'PaymentService'
);
```

---

<h2 name="configuracao">Configuração</h2>

### LoggerService

O `LoggerService` pode ser utilizado:

- De forma estática;
- Via instância com configurações específicas;

<details>
<summary>Exemplo utilizando instância personalizada:</summary>

| Opção | Tipo | Descrição |
|---|---|---|
| `colorize` | `boolean` | Habilita cores no output do terminal |
| `outputMode` | `'LOG' \| 'JSON' \| 'BOTH'` | Define o formato de saída dos logs |
| `type` | `Record<string, string>` | Cor por nível de log |

```js
const { LoggerService } = require('micro-log-lib');

const options = {
  colorize: true,
  outputMode: 'BOTH',
  type: {
    ERROR: 'RED',
    WARN: 'YELLOW',
    INFO: 'BLUE',
    DEBUG: 'GREEN'
  }
};

const logger = new LoggerService(options);

logger.info('Servidor iniciado na porta 3000');
```

</details>

<details>
<summary>Tipos de output</summary>

### LOG

```txt
[INFO] [AuthService] Usuário autenticado
UUID: cf35f8e0dbf4813a5259
```

### JSON

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

---

### SanitizerService

O `SanitizerService` aplica configurações globais, afetando todos os logs da aplicação independentemente da instância utilizada.

<details>
<summary>Atributos e exemplo de implementação</summary>

| Opção | Tipo | Descrição |
|---|---|---|
| `sanitizeFields` | `string[]` | Campos que devem ser ocultados |
| `redactValue` | `string` | Texto substituto dos campos sanitizados |

```js
const { SanitizerService } = require('micro-log-lib');

const sensitiveFields = [
  'access-token',
  'refresh-token',
  'password'
];

SanitizerService.addFields(sensitiveFields);

SanitizerService.updateRedactValue(
  '[SENSITIVE DATA]'
);
```

</details>

<details>
<summary>Exemplo de sanitização integrada</summary>

```js
const { LoggerService, SanitizerService } = require('micro-log-lib');

SanitizerService.addFields([
  'password'
]);

LoggerService.info(
  'Login realizado',
  {
    email: 'user@email.com',
    password: '123456'
  }
);
```

Output:

```json
{
  "email": "user@email.com",
  "password": "[SENSITIVE DATA]"
}
```

</details>

---

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
constructor(options = {}) {
    this.validate(options);
    // [...]
    this.#config = merged;
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
  return this.debug('DEBUG', message, data, service, uuid);
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
  return this.info('INFO', message, data, service, uuid);
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
  return this.warn('WARN', message, data, service, uuid);
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
  return this.warn('WARN', message, data, service, uuid);
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
  return this.warn('FATAL', message, data, service, uuid);
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

#### addFields()

Adiciona campos personalizados que também devem ser sanitizados.

- Método estático, logo, aplica-se independentemente da instância;

```ts
static updateSanitizeFields(option: string[]): void {
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

Características:
- Método estático, logo, aplica-se independentemente da instância;

```ts
static updateRedactValue(text: string): void {
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
static sanitize(data) {
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
