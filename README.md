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
            test: node.cond,
            consequent: node.expr1,
            alternate: node.expr2
        }
    };
  }
  // , ...
}))
.map(aster.dest('dist'))
.subscribe(aster.runner);
```

## API

### equery(mappings)

#### mappings
Type: `{pattern: handler}`

Replacement mappings.

##### pattern
Type: `String`

[CSS-style node selector](http://graspjs.com/docs/squery/).

##### handler
Type: `Function(node)`

Callback to be called on each found match. It will receive matched node object as argument.

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)

[npm-url]: https://npmjs.org/package/aster-squery
[npm-image]: https://badge.fury.io/js/aster-squery.png

[travis-url]: http://travis-ci.org/asterjs/aster-squery
[travis-image]: https://secure.travis-ci.org/asterjs/aster-squery.png?branch=master
