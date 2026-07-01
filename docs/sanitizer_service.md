# SanitizerService

Serviço responsável pela sanitização de campos sensíveis de objetos JSON.

## Atributos

- `#sanitizeFields`
  - Objeto que possui os parâmetros a serem sanitizados.

- `#redactValue`
  - Valor de omissão utilizado no serviço de sanitização.

---

## Métodos

### addSanitizeFields()

Adiciona campos personalizados a lista dos parâmetros que devem ser sanitizados.

```ts
addSanitizeFields(option: string | string[]): void {
  // [...]
  this.#sanitizeFields = merge;
}
```

Input:
```json
[ 'password', 'access-token', 'refresh-token' ]
```

### getSanitizeFields()

Recupera os parâmetros da lista de sanitização.

```ts
getSanitizeFields(): Record<string, boolean> {
  return this.#sanitizeFields;
};
```

### resetSanitizeFields()

Reseta os parâmetros padrões do serviço de sanitização.

- Usando para realizar testes;

```ts
resetSanitizeFields(): Record<string, boolean> {
  return this.#sanitizeFields;
};
```

### getRedactValue()

Recupera o valor de omissão usado naquela instância do serviço de sanitização.

```ts
getRedactValue(): string {
  return this.#sanitizeFields;
};
```

### updateRedactValue()

Atualiza o valor de omissão usado naquela instância do serviço de sanitização.

```ts
updateRedactValue(text: string): void {
  // [...]
  this.redactValue = value;
}
```

Input:
```json
[SENSITIVE DATA]
```

### sanitize()

Responsável pela sanitização dos dados dos logs.

Características:

- Sanitização baseada nas chaves do objeto;
- As chaves são "insensitive case";
- Sanitização compatível com múltiplos níveis de profundidade construído em cima de recursivdade;

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

* (Supondo que os campos do sanitizer fields são: 'password' e 'phone').

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

### clone()

Retorna uma nova instância do 'SanitizerService' herdando os parâmetros do pai.

```ts
clone() {
    return new SanitizerService(
        this.#redactValue,
        this.#sanitizeFields,
    );
};
```