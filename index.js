'use strict';

const util = require('util');

class PromisifyHandler {
	constructor(members) {
		this.cache = {};
		this.members = members;
	}
	get(target, name) {
		if (this.members.indexOf(name) === -1) {
			return target[name];
		}

		if (typeof this.cache[name] !== 'undefined') {
			return this.cache[name];
		}

		this.cache[name] = util.promisify(target[name]);

		return this.cache[name];
	}
	set(target, name, value) {
		if (this.members.indexOf(name) !== -1) {
			throw new Error('Cannot set promisified members.');
		}

		target[name] = value;

		return true;
	}
}

/**
 * ES6 Proxy to promisify members.
 *
 * @param {!Object} obj - Object with members to be promisify'ed.
 * @param {!Array} members - Names of members that should be promisify'ed.
 */
module.exports = function promisifyProxy(obj, members) {
	if (typeof obj !== 'object' || !obj) {
		throw new TypeError('Requires an object.');
	}

	if (typeof members === 'undefined' || !Array.isArray(members) || !members.length) {
		throw new TypeError('Requires a non-empty array of members.');
	}

	return new Proxy(obj, new PromisifyHandler(members));
};
