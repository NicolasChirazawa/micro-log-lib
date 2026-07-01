# FormatterService

Responsável pela formatação customizável dos logs.

## Particularidade de implementação

O funcionamento do '#format' segue a seguinte lógica:

Exemplo: `[${timestamp}] [${id}] [${type} - ${service}] ${message}`.

Para capturar valores do logs no template, basta aplicar a busca através da sintaxe de um objeto no seguinte formato:

`${chave_do_log.chave_aninhada...}`

* É possível capturar qualquer nível de profundidade dum objeto;
** Se o objeto não existir, indiferente de onde seja o nível, é retornado "undefined";

## Atributos

- `format`
  - Template de texto para construção de logs personalizados.

## Métodos

### set format()

Método para settar um novo template para a classe `FormatterService`.

```ts
set format(template: string): void {
    this.#format = template;
}
```

### get format()

Método para recuperar o '#format' da instância da classe `FormatterService`.

```ts
get format(): string {
    return this.#format;
}
```

### transformTemplateToLog()

Método responsável pela construção do texto do log customizável utilizando do template definido e o corpo do log.

```ts
transformTemplateToLog(body) {
    const format = this.#format;
    // [...]
    return log;
}
```

### Private getValueFromPath()

Método que baseado no corpo do objeto, através de um loop recursivo, captura o valor de uma chave.

```ts
#getValueFromPath(body, object_value_text) {
    const cleanNameObject = object_value_text.slice(2, object_value_text.length - 1);
    // [...]
    return value;
}
```

### clone()

Retorna uma nova instância do 'FormatterService' herdando os parâmetros do pai.

```ts
clone(): Object {
    return new FormatterService(this.#formatField);
};
```