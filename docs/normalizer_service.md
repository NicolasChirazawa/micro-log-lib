# NormalizerService

Serviço responsável pela padronização de strings diante as demais classes do sistema.

## Métodos

### upper()

Converte uma string para letras maiúsculas.

```ts
static upper(variable: string): string {
  return String(variable).toUpperCase();
}
```

Input: 'Texto exemplo'
Output: 'TEXTO EXEMPLO'

### lower()

Converte uma string para letras minúsculas.

```ts
static lower(variable: string): string {
  return String(variable).toLowerCase();
}
```

Input: 'Texto exemplo'
Output: 'texto exemplo'