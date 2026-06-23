# ContextService

Serviço responsável pela contextualização dos loggers 'child'.

## Atributos

- `collection`
  - Objeto que possui o contexto (suporta 'serviceName' e 'data').

## Métodos

### create()

Alimenta o atributo '#collection' da instância da classe.

```ts
create(data, serviceName, context) {
    this.#validateCreateContext({data, serviceName, context});
    // [...]
};
```

### Private validateCreateContext()

Realiza a validação dos parâmetros usados para a criação de contexto na instância do 'contextService'.

```ts
#validateCreateContext({data, serviceName, context}) {
  let errorList = [];
  // [...]
  return;
}
```

### inject()

Injeta a coleção/contexto da instância do 'contextService' no 'loggerService' de qualquer variação ('DEBUG', 'INFO', 'WARN', 'FATAL').

```ts
inject(data, serviceName): Object {
  let [contextData, contextService] = [data, serviceName];
  // [...]
  return { contextData, contextService };
};
```

*Caso as informações da coleção também estejam presentes no logger, é sobreposto o contexto com o logger vigente.*

### get()

Recolhe os dados instância atual da coleção.

```ts
get(): Object {
    return this.#collection;
};
```