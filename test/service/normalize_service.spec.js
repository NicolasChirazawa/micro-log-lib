const assert = require('node:assert');
const { test, describe, it } = require('node:test');

const { NormalizeService } = require('../../lib/core/normalize_service');

const input = 'AbC1'

describe('NormalizeService Class', () => {
    describe('"upper" method', () => {
        test('Transform a word into uppercase', () => {
            const result = NormalizeService.upper(input);
            const output = String(input).toUpperCase();
            assert.deepEqual(
                result,
                output,
            );
        });
    });
    describe('"lower" method', () => {
        test('Convert an "Array" into an "Object', () => {
            const result = NormalizeService.lower(input);
            const output = String(input).toLowerCase();
            assert.deepEqual(
                result,
                output,
            );
        });
    });
});
