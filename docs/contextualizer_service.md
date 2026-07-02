# ContextualizerService

Serviço responsável pela contextualização dos loggers 'child'.

## Particularidade de implementação

O funcionamento das 'injeções' de contexto segue a seguinte lógica:
ContextualizerService (pai) > ContextualizerService (filho) > LoggerService

Para facilitar na lembrança, a sobreposição, seja do 'data' ou do contexto é sempre
feita por quem chama a frente.

## Atributos

- `collection`
  - Objeto que possui o contexto.

## Métodos

### create()

Alimenta o atributo '#collection' da instância da classe.

```ts
create(data) {
  this.#collection = this.inject(data);
};
```

### Private validate()

Realiza a validação dos parâmetros usados para a criação de contexto na instância do 'ContextualizerService'.

```ts
#validate(data, context): void {
  let errorList = [];
  // [...]
  return;
}
```

### inject()

Injeta a coleção/contexto da instância do 'ContextualizerService' no 'LoggerService' de qualquer variação ('DEBUG', 'INFO', 'WARN', 'FATAL').

```ts
inject(data = {}): Object {
  const contextCollection = this.#collection;
  // [...]
  return contextData;
};
```

### private injectContext()

  Método recursivo responsável pela sanitização das chaves de um objeto 'data'.

  ```ts
  #injectContext(dataCollection, dataKeys, contextCollection, contextKeys) { 
      for (let i = 0; i < contextKeys.length; i++) { 
        //[...]
      }
      return dataCollection;
  };
  ```

### clone()

Retorna uma nova instância do 'ContextualizerService' herdando os parâmetros do pai.

```ts
clone(): Object {
  return new ContextualizerService(this.#collection);
};
```