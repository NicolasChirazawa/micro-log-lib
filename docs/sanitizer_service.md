# SanitizerService

Serviço responsável pela sanitização de campos sensíveis de objetos JSON.

## Atributos

- `sanitizeFields`
  - Objeto que possui os campos a serem sanitizados

- `redactValue`
  - Valor substituto utilizado na sanitização

---

## Métodos

### addFields()

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

(Supondo que os campos do sanitizer fields são: 'password' e 'phone')

```json
{
  "email": "teste@gmail.com",
  "password": "[SENSITIVE DATA]",
  "data": {
    "phone": "[SENSITIVE DATA]"
  }
}
```