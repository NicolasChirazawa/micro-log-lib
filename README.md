<h1 align="center">micro-log-lib</h1>

<p align="center">
  <img src="https://img.shields.io/static/v1?label=%20&labelColor=fffdaf&message=Javascript&color=grey&style=for-the-badge&logo=javascript&logoColor=black"/>
  <img src="https://img.shields.io/static/v1?label=%20&labelColor=d1ffbd&message=Node.JS&color=grey&style=for-the-badge&logo=node.js&logoColor=black"/>
</p>

<p align="center">
  Biblioteca de logging extremamente leve, conveniente e configurável.<br/>
  Projetada para atender projetos em qualquer nível de maturidade.
</p>

<p align="center">
  <a href="#instalacao">Instalação</a> •
  <a href="#funcionalidades">Funcionalidades</a> •
  <a href="#comeco-rapido">Começo rápido</a> •
  <a href="#configuracao">Configuração</a> •
  <a href="#documentacao">Documentação</a>
</p>

---

<h2 name="instalacao">Instalação</h2>

```bash
npm install micro-log-lib
```

---

<h2 name="funcionalidades">Funcionalidades</h2>

- **Níveis de log** — `debug`, `info`, `warn` e `error`
- **Output flexível** — `LOG` (console.log), `JSON` ou ambos (`BOTH`)
- **Cores customizáveis** — configuráveis por nível de log
- **Sanitização de campos sensíveis** — com valor substituto customizável
- **Rastreabilidade** — via códigos UUID automáticos

---

<h2 name="comeco-rapido">Começo Rápido</h2>

```js
const { LoggerService, SanitizerService } = require('micro-log-lib');

// LoggerService.{level}(message, data_object?, class_name?)

LoggerService.info('Usuário autenticado', { userId: 'abc123' }, 'AuthService');
LoggerService.debug('Iniciando conexão', { host: 'localhost' }, 'DbService');
LoggerService.warn('Rate limit próximo', { remaining: 5 }, 'ApiService');
LoggerService.error('Falha ao processar', { code: 500 }, 'PaymentService');
```

---

<h2 name="configuracao">Configuração</h2>

### LoggerService

O `LoggerService` aceita configurações por instância, permitindo diferentes comportamentos em partes distintas do código.

<details>
<summary>Atributos e exemplo de implementação</summary>
<br>


| Opção | Tipo | Descrição |
|---|---|---|
| `colorize` | `boolean` | Habilita cores no output via `console.log` |
| `outputMode` | `'LOG' \| 'JSON' \| 'BOTH'` | Define o formato do output dos logs |
| `type` | `Record<string, string>` | Cor por nível: `'ERROR'`, `'WARN'`, `'DEBUG'`, `'INFO'` |

```js
const { LoggerService } = require('micro-log-lib');

const options = {
  colorize: true,
  outputMode: 'BOTH',
  type: { 'ERROR': 'RED' }
};

const logger = new LoggerService(options);
logger.info('Servidor iniciado na porta 3000');
```
</details>

---

### SanitizerService

O `SanitizerService` aplica configurações estáticas globais, afetando todos os logs do projeto independente da instância.

<details>
<summary>Atributos e exemplo de implementação</summary>
<br>

| Opção | Tipo | Descrição |
|---|---|---|
| `sanitizeFields` | `string[]` | Lista de campos a serem ocultados nos logs |
| `redactValue` | `string` | Texto substituto para os campos sanitizados |

```js
const { SanitizerService } = require('micro-log-lib');

const sensitiveFields = ['access-token', 'refresh-token', 'password'];
SanitizerService.updateSanitizeFields(sensitiveFields);

const redactValue = '[SENSITIVE DATA]';
SanitizerService.updateRedactValue(redactValue);

// Campos serão automaticamente ocultados em todos os logs
```

</details>

<h2 name="documentacao">Documentação</h2>

*Serviços principais (uso do desenvolvedor)*

### SanitizerService
Sanitizar os campos sensíveis de um JSON baseado nas suas chaves de sanitização. 

<details>
<summary>Documentação de atributos e métodos</summary>
<br>
  
#### Atributos
- `sanitizeFields`: Campos para serem sanitizados;
- `redactValue`: Valor de substituição aos campos que serão sanitizados;

#### Métodos
- `updateSanitizeFields()`: Adição de novos campos ao atributo '#sanitizeFields';

```ts
static updateSanitizeFields(option: string[]): void {
  // [...]
  SanitizerService.#sanitizeFields = merge;
};

// Exemplo de input: ['teste 1', 'teste 2', 'teste 3', 'teste 4'];
```

- `updateSanitizeValue()`: Adição de novos campos ao atributo '#sanitizeFields';

```ts
static updateSanitizeFields(text: string): void {
  // [...]
  SanitizerService.redactValue = value;
};

// Exemplo de input: '[TEXTO CENSURADO]';
```

- `sanitizeData()`: Função responsável pela sanitização dos dados;
```ts

/*
  Sanitiza baseado em chaves de objetos;
  A chave não é sensitive case;
  Sanitiza independente do nível de profundidade no log (construído de forma recursiva);
  
*/

static sanitizeData(data) {
  let keys = Object.keys(data);
  /// [...]
  return data;
}

  /* 
    Exemplo de input: {
      e-mail: teste@gmail.com,
      senha: 123456789,
      data: {
        telefone: 1234-5678
      }
    };
  
  /*
    Exemplo de output:  {
      e-mail: teste@gmail.com,
      senha: [TEXTO CENSURADO],
      data: {
        telefone: [TEXTO CENSURADO]
      }
    }
  */
```

</details>

---

*Serviços auxiliares (uso da biblioteca)*

### NormalizeService
Padronizar strings entre serviços.

<details>
<summary>Documentação de atributos e métodos</summary>
<br>

#### Métodos
- `upper()`: Cria e retorna uma string normalizada para maiúsculo;

```ts
static upper(variable: string): string {
    return String(variable).toUpperCase();
};

// Exemplo de input: 'Nome Bacana'
// Exemplo de retorno: 'NOME BACANA'
```

- `lower()`: Cria e retorna uma string normalizada para minúsculo;

```ts
static lower(variable: string): string {
    return String(variable).toLowerCase();
}

// Exemplo de input: 'Nome Bacana'
// Exemplo de retorno: 'nome bacana'
  ```

</details>

### UUIDService
Criar UUIDs para outros serviços;

<details>
<summary>Documentação de atributos e métodos</summary>
<br>

#### Métodos
- `generate()`: Cria e retorna uma substring de UUID de 20 caracteres com os hiféns limpos;

```ts
static generate(): string {
  return randomUUID().replaceAll('-', '').slice(0, 20);
};

// Exemplo de retorno: cf35f8e0dbf4813a5259
```

</details>
