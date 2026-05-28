# FormatterService

Responsável pela formatação de logs.

## Particularidade de implementação

O funcionamento do '#format' funciona da seguinte forma:

Exemplo: `[${timestamp}] [${id}] [${type} - ${service}] ${message}`.

Para capturar valores do logs no template, basta aplicar a busca através da sintaxe de um objeto no seguinte formato:

`${chave_do_log.chave_aninhada...}`

* É possível capturar qualquer nível de profundidade dum objeto.

## Atributos

- `format`
  - Template de texto para utilização de logs personalizados.

## Métodos

### set format()

Método para settar um novo template para a classe `FormatterService`.

```ts
static set format(template: string): void {
    this.#format = template;
}
```

### get format()

Método para recuperar o '#format' da classe `FormatterService`.

```ts
static get format(): string {
    return this.#format;
}
```

#### transformTemplateToLog()

Método que faz a construção do texto do log utilizando o template e o objeto do log.

```ts
static transformTemplateToLog(body) {
    const format = this.#format;
    // [...]
    return log;
}
```

#### Private getValueFromPath()

Método que baseado no texto do objeto, captura o valor através de um loop baseado nas chaves.

```ts
static #getValueFromPath(body, object_value_text) {
    const cleanNameObject = object_value_text.slice(2, object_value_text.length - 1);
    // [...]
    return value;
}
```