'use strict';

const assert = require('assert');
const promisifyProxy = require('..');

class testObject {
	doCallback(success, cb) {
		if (success) {
			cb(null, 'requested success');
		} else {
			cb(new Error('requested failure'));
		}
	}
}

describe('@cfware/promisify-proxy', () => {
	describe('constructor throws', () => {
		it('undefined obj throws', () => assert.throws(() => new promisifyProxy()));
		it('null obj throws', () => assert.throws(() => new promisifyProxy(null)));
		it('obj is not object throws', () => assert.throws(() => new promisifyProxy('blue')));

		it('undefined members throws', () => assert.throws(() => new promisifyProxy({})));
		it('non-array members throws', () => assert.throws(() => new promisifyProxy({}, {})));
		it('empty members array throws', () => assert.throws(() => new promisifyProxy({}, [])));

		it('obj and non-empty members array does not throw', () => {
			new promisifyProxy({}, ['test']);
		});
	});

	describe('test object', () => {
		let testobj;
		let testproxy;

		beforeEach(() => {
			testobj = new testObject();
			testproxy = new promisifyProxy(testobj, ['doCallback']);
		});

		afterEach(() => {
			testobj = null;
			testproxy = null;
		});

		it('non-promisified property read/write still works', () => {
			testobj.test_value = 1;
			assert.equal(testproxy.test_value, 1, 'test_value not correct');

			testobj.test_value = 15;
			assert.equal(testproxy.test_value, 15, 'test_value not correct');

		});

		it('non-promisified proxy set accepted', () => {
			testproxy.test_value = 2;
			assert.equal(testobj.test_value, 2, 'test_value not correct');
		});

		it('promisified proxy set rejected', () => {
			const orig_cb = testproxy.doCallback;

			assert.throws(() => testproxy.doCallback = null);
			assert.equal(orig_cb, testproxy.doCallback);
		});

		it('promisified member success', () => testproxy.doCallback(true));
		it('promisified member failure', done => {
			testproxy.doCallback(false)
				.then(() => done(new Error('Promise should be rejected')))
				.catch(() => done());
		});
		it('promisified member caching', () => {
			/* util.promisify returns a new function wrapper on each call. */
			assert.equal(testproxy.doCallback, testproxy.doCallback);
		});

		it('testproxy.has operates on testobject', () => {
			delete testobj.test_key;
			assert.ok(!('test_key' in testproxy));

			testobj.test_key = false;
			assert.ok('test_key' in testproxy);
		});
	});
});
