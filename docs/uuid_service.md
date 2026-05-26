# UUIDService

Serviço responsável pela geração de UUIDs utilizados internamente pela biblioteca.

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

Output: cf35f8e0dbf4813a5259