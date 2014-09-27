'use strict';

var Rx = require('rx');
var squery = require('grasp-squery');
var Map = require('es6-map');
var traverse = require('estraverse').replace;
var estemplate = require('estemplate');

module.exports = function (options) {
	var replaces = Rx.Observable.fromArray(Object.keys(options)).map(function (selector) {
		var handler = options[selector];

		if (typeof handler === 'string') {
			var canBeExprStmt = handler.slice(-1) === ';';
			var tmpl = estemplate.compile(handler, {tolerant: true});

			handler = function (node) {
				var ast = tmpl(node);

				switch (ast.body.length) {
					case 0:
						ast = null;
						break;

					case 1:
						ast = ast.body[0];

						if (ast.type === 'ExpressionStatement' && !canBeExprStmt) {
							ast = ast.expression;
						}

						break;

					default:
						ast.type = 'BlockStatement';
				}

				return ast;
			};
		}

		return {
			selector: squery.parse(selector),
			handler: handler
		};
	});

	return function (files) {
		return files.flatMap(function (file) {
			return replaces
				.flatMap(function (replace) {
					var handler = replace.handler;

					return Rx.Observable.fromArray(squery.queryParsed(replace.selector, file.program)).map(function (node) {
						return [node, handler(node)];
					});
				})
				.filter(function (replace) { return replace[1] !== undefined })
				.toArray()
				.map(function (replaces) {
					file.program = traverse(file.program, {
						leave: Map.prototype.get.bind(new Map(replaces))
					});

					return file;
				});
		});
	}
};
