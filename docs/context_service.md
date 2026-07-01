# ContextService

Serviço responsável pela contextualização dos loggers 'child'.

## Particularidade de implementação

O funcionamento das 'injeções' de contexto segue a seguinte lógica:
ContextService (pai) > ContextService (filho) > LoggerService

Para facilitar na lembrança, a sobreposição, seja do 'data' ou do contexto é sempre
feita por quem chama a frente.

## Atributos

- `collection`
  - Objeto que possui o contexto (suporta 'serviceName' e 'data').

## Métodos

### create()

Alimenta o atributo '#collection' da instância da classe.

```ts
create(data) {
  this.#collection = this.inject(data);
};
```

### Private validate()

Realiza a validação dos parâmetros usados para a criação de contexto na instância do 'contextService'.

```ts
#validateCreateContext(data, context): void {
  let errorList = [];
  // [...]
  return;
}
```

### inject()

Injeta a coleção/contexto da instância do 'contextService' no 'loggerService' de qualquer variação ('DEBUG', 'INFO', 'WARN', 'FATAL').

```ts
inject(data): Object {
  let [contextData, contextService] = [data, serviceName];
  // [...]
  return { contextData, contextService };
};
```

### clone()

Retorna uma nova instância do 'ContextService' herdando os parâmetros do pai.

```ts
clone(): Object {
  return new ContextService(this.#collection);
};
```