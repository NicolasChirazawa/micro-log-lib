const assert = require('node:assert');
const { test, describe, it } = require('node:test');

const { NormalizerService } = require('../../lib/core/normalizer_service');

const input = 'AbC1'

describe('NormalizeService Class', () => {
    describe('"upper" method', () => {
        test('Transform a word into uppercase', () => {
            const result = NormalizerService.upper(input);
            const output = String(input).toUpperCase();
            assert.deepEqual(
                result,
                output,
            );
        });
    });
    describe('"lower" method', () => {
        test('Convert an "Array" into an "Object', () => {
            const result = NormalizerService.lower(input);
            const output = String(input).toLowerCase();
            assert.deepEqual(
                result,
                output,
            );
        });
    });
});
