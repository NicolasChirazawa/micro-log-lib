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
  <a href="#documentacao">Documentação</a>
</p>

---

<h2 name="instalacao" align="center">Instalação</h2>

```bash
npm install micro-log-lib
```

---

<h2 name="funcionalidades" align="center">Funcionalidades</h2>

- **Níveis de log** — `debug`, `info`, `warn` e `error`;
- **Output flexível** — `LOG`, `JSON` ou ambos (`BOTH`);
- **Cores customizáveis** — configuráveis por nível de log;
- **Sanitização automática** — ocultação de dados sensíveis;
- **Rastreabilidade** — geração automática de UUID;
- **Configuração por instância** — diferentes comportamentos por contexto;

---

<h2 name="primeiros-passos" align="center">Primeiros passos</h2>

```js
const { LoggerService } = require('micro-log-lib');

// LoggerService.{level}(message, data?, context?)

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

<h2 name="configuracao" align="center">Configuração</h2>

## LoggerService

O `LoggerService` pode ser utilizado:

- De forma estática
- Ou via instância com configurações específicas

Exemplo utilizando instância personalizada:

<details>
<summary>Atributos e exemplo de implementação</summary>
<br>

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

---

### Tipos de output

#### LOG

```txt
[INFO] Usuário autenticado
```

#### JSON

```json
{
  "level": "INFO",
  "message": "Usuário autenticado",
  "context": "AuthService"
}
```

---

## SanitizerService

O `SanitizerService` aplica configurações globais, afetando todos os logs da aplicação independentemente da instância utilizada.

<details>
<summary>Atributos e exemplo de implementação</summary>
<br>

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

SanitizerService.updateSanitizeFields(sensitiveFields);

SanitizerService.updateRedactValue(
  '[SENSITIVE DATA]'
);
```

</details>

### Exemplo de sanitização integrada

```js
const { LoggerService, SanitizerService } = require('micro-log-lib');

SanitizerService.updateSanitizeFields([
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

---

<h2 name="documentacao" align="center">Documentação</h2>

## Serviços principais

### SanitizerService

Responsável por sanitizar campos sensíveis de objetos JSON com base nas chaves configuradas.

<details>
<summary>Documentação de atributos e métodos</summary>
<br>

## Atributos

- `sanitizeFields`
  - Campos que devem ser sanitizados

- `redactValue`
  - Valor substituto utilizado na sanitização

---

## Métodos

### updateSanitizeFields()

Atualiza os campos que devem ser sanitizados.

```ts
static updateSanitizeFields(option: string[]): void {
  // [...]
  SanitizerService.#sanitizeFields = merge;
}
```

Exemplo:

```ts
[
  'password',
  'access-token',
  'refresh-token'
]
```

---

### updateRedactValue()

Atualiza o valor utilizado para substituir os campos sensíveis.

```ts
static updateRedactValue(text: string): void {
  // [...]
  SanitizerService.redactValue = value;
}
```

Exemplo:

```ts
'[SENSITIVE DATA]'
```

---

### sanitizeData()

Função responsável pela sanitização dos dados.

Características:

- Sanitização baseada nas chaves do objeto
- Comparação case insensitive
- Sanitização recursiva
- Compatível com múltiplos níveis de profundidade

```ts
static sanitizeData(data) {
  let keys = Object.keys(data);
  // [...]
  return data;
}
```

Exemplo de input:

```json
{
  "email": "teste@gmail.com",
  "password": "123456789",
  "data": {
    "phone": "1234-5678"
  }
}
```

Exemplo de output:

```json
{
  "email": "teste@gmail.com",
  "password": "[SENSITIVE DATA]",
  "data": {
    "phone": "[SENSITIVE DATA]"
  }
}
```

</details>

---

## Serviços auxiliares

### NormalizeService

Responsável pela padronização de strings entre os serviços internos.

<details>
<summary>Documentação de atributos e métodos</summary>
<br>

## Métodos

### upper()

Converte uma string para letras maiúsculas.

```ts
static upper(variable: string): string {
  return String(variable).toUpperCase();
}
```

Input:

```ts
'Texto exemplo'
```

Output:

```ts
'TEXTO EXEMPLO'
```

---

### lower()

Converte uma string para letras minúsculas.

```ts
static lower(variable: string): string {
  return String(variable).toLowerCase();
}
```

Input:

```ts
'Texto exemplo'
```

Output:

```ts
'texto exemplo'
```

</details>

---

### UUIDService

Responsável pela geração de UUIDs utilizados internamente pela biblioteca.

<details>
<summary>Documentação de atributos e métodos</summary>
<br>

## Métodos

### generate()

Cria e retorna uma substring UUID sem hífens contendo 20 caracteres.

```ts
static generate(): string {
  return randomUUID()
    .replaceAll('-', '')
    .slice(0, 20);
}
```

Exemplo de retorno:

```txt
cf35f8e0dbf4813a5259
```

</details>
