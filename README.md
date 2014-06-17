# aster-squery
[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]

> Replace nodes with CSS-like selectors in aster.

Allows to use CSS-style selectors for finding nodes and replacing them with results of corresponding handlers.

Uses [grasp-squery](https://npmjs.org/package/grasp-squery) behind the scenes, so check out [official documentation](http://graspjs.com/docs/squery/) for syntax details.

## Usage

First, install `aster-squery` as a development dependency:

```shell
npm install --save-dev aster-squery
```

Then, add it to your build script:

```javascript
var aster = require('aster');
var squery = require('aster-squery');

aster.src('src/**/*.js')
.map(squery({
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
  // , ...
}))
.map(aster.dest('dist'))
.subscribe(aster.runner);
```

can be also written as:

```javascript
var aster = require('aster');
var equery = require('aster-equery');

aster.src('src/**/*.js')
.map(equery({
  'if[then=return][else=return]': 'return <%= test %> ? <%= consequent.argument %> : <%= alternate.argument %>'
  // , ...
}))
.map(aster.dest('dist'))
.subscribe(aster.runner);
```

## API

### squery(mappings)

#### mappings
Type: `{pattern: handler}`

Replacement mappings.

##### pattern
Type: `String`

[CSS-style node selector](http://graspjs.com/docs/squery/).

##### handler (option 1: callback)
Type: `Function(node, named)`

Callback to be called on each found match. It will get two arguments - matched node object and hashmap of named subpatterns.

##### handler (option 2: template)
Type: `String`

[estemplate](https://github.com/RReverser/estemplate) string to be used for generating AST.

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)

[npm-url]: https://npmjs.org/package/aster-squery
[npm-image]: https://badge.fury.io/js/aster-squery.png

[travis-url]: http://travis-ci.org/asterjs/aster-squery
[travis-image]: https://secure.travis-ci.org/asterjs/aster-squery.png?branch=master
