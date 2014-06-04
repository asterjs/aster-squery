/* global describe, it */

'use strict';

var assert = require('chai').assert,
	Rx = require('rx'),
	equery = require('..'),
	parse = require('esprima').parse,
	generate = require('escodegen').generate;

it('test', function (done) {
	var input = [{
			type: 'File',
			program: parse('function isEven(x) {\n    if ((x & 1) === 0)\n        return \'yes\';\n    else\n        return \'no\';\n}'),
			loc: {
				source: 'file.js'
			}
		}],
		expected = ['function isEven(x) {\n    return (x & 1) === 0 ? \'yes\' : \'no\';\n}'];

	// simulating file sequence and applying transformation
	equery({
		'if[then=return][else=return]': function (node) {
			return {
				type: 'ReturnStatement',
				argument: {
					type: 'ConditionalExpression',
					test: node.test,
					consequent: node.consequent.argument,
					alternate: node.alternate.argument
				}
			};
		}
	})(Rx.Observable.fromArray(input))
	.pluck('program')
	.map(generate)
	.zip(expected, assert.equal)
	.subscribe(function () {}, done, done);
});

