# SanitizerService

Serviço responsável pela sanitização de campos sensíveis de objetos JSON.

## Atributos

- `sanitizeFields`
  - Objeto que possui os campos a serem sanitizados

- `redactValue`
  - Valor substituto utilizado na sanitização

---

## Métodos

### addSanitizeFields()

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

### getSanitizeFields()

Recupera os valores da lista de sanitização.

- Método estático, logo, aplica-se independentemente da instância;

```ts
static getSanitizeFields(): Record<string, boolean> {
  return this.#sanitizeFields;
};
```

### resetSanitizeFields()

Reseta os valores de sanitização padrão do serviço de sanitização.

- Usando para realizar testes;

```ts
static getSanitizeFields(): Record<string, boolean> {
  return this.#sanitizeFields;
};
```

### getRedactValue()

Recolhe o valor de substituição do serviço de sanitização.

- Verifica o valor de sanitização;

```ts
static getRedactValue(): string {
  return this.#sanitizeFields;
};
```

### updateRedactValue()

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

### sanitize()

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

(Supondo que os campos do sanitizer fields são: 'password' e 'phone').