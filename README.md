# broccoli-babel-plugin

[![Latest Stable Version](https://img.shields.io/npm/v/broccoli-babel-plugin.svg)](https://www.npmjs.com/package/broccoli-babel-plugin)
[![License](https://img.shields.io/npm/l/broccoli-babel-plugin.svg)](./LICENSE)
[![Build Status](https://img.shields.io/travis/Lodin/broccoli-babel-plugin/master.svg)](https://travis-ci.org/Lodin/broccoli-babel-plugin)

[![Test Coverage](https://img.shields.io/codecov/c/github/Lodin/broccoli-babel-plugin/master.svg)](https://codecov.io/gh/Lodin/broccoli-babel-plugin)

A [Broccoli](https://github.com/broccolijs/broccoli) plugin which 
transpiles ES6 to ES5 using [babel](https://github.com/babel/babel) 
of version 6.

## How to install?

```bash
$ npm install --save-dev broccoli-babel-plugin 
```

## How to use?

In your `Brocfile.js`:

```javascript
var Babel = require('broccoli-babel-plugin');
var nodes = new Babel(inputNodes, options);
```

You can find [options](http://babeljs.io/docs/usage/options/) at babel's github repo.
