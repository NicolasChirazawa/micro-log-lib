const assert = require('node:assert');
const { test, describe, it } = require('node:test');

const { arrayToObject } = require('../../lib/core/utils/array_to_object');

const arrayElements_1 = ['valor', 'elemento', '2'];
const arrayElements_2 = [];
const notArray = "Legal";

describe('Array_to_object function', () => {
    test('Convert an "Array" into an "Object', () => {
        const objectElement = arrayToObject(arrayElements_1);

        const compare = { valor: true, elemento: true, '2': true };

        assert.deepEqual(
            objectElement,
            compare,
        );
    });

    test('Convert an empty "Array" into an empty "Object', () => {
        const objectElement = arrayToObject(arrayElements_2);
        const compare = {};

        assert.deepEqual(
            objectElement,
            compare,
        );
    });

    test('Throw an error in conversion if input typeof is different of "Array"', () => {
        assert.throws(() => {
            arrayToObject(notArray)
        }, TypeError );
    });
});
