# @cfware/promisify-proxy

[![Travis CI][travis-image]][travis-url]
[![Coverage Status][coverage-image]][coverage-url]
[![Greenkeeper badge](https://badges.greenkeeper.io/cfware/promisify-proxy.svg)](https://greenkeeper.io/)
[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![MIT][license-image]](LICENSE)

ES6 Proxy object for promisifying selected members of an object.

### Install @cfware/promisify-proxy

This module requires node.js 8 or above.

```sh
npm i --save @cfware/promisify-proxy
```

## Usage

```js
'use strict';

const promisifyProxy = require('@cfware/promisify-proxy');
const fs = promisifyProxy(require('fs'), ['stat']);

/* stat gets promisified. */
fs.stat('filename.txt')
	.then(console.log)
	.catch(console.error);

/* access does not get promisified. */
fs.access('filename.txt', err => {
	if (err) {
		console.error(err);
	} else {
		console.log('fs.access successful.');
	}
});

```

## Running tests

Tests are provided by eslint and mocha.

```sh
npm install
npm test
```

[npm-image]: https://img.shields.io/npm/v/@cfware/promisify-proxy.svg
[npm-url]: https://npmjs.org/package/@cfware/promisify-proxy
[travis-image]: https://travis-ci.org/cfware/promisify-proxy.svg?branch=master
[travis-url]: https://travis-ci.org/cfware/promisify-proxy
[coverage-image]: https://coveralls.io/repos/github/cfware/promisify-proxy/badge.svg
[coverage-url]: https://coveralls.io/github/cfware/promisify-proxy
[downloads-image]: https://img.shields.io/npm/dm/@cfware/promisify-proxy.svg
[downloads-url]: https://npmjs.org/package/@cfware/promisify-proxy
[license-image]: https://img.shields.io/github/license/cfware/promisify-proxy.svg
