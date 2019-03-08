/*global module, console, require */
/**
 * Base Object for Tester instance
 * @author Piotr Karny <p.karny@samsung.com>
 */
var	os = require("os");

module.exports = (function () {
	var proto;

	function BaseTester() {
		this.storage = {};
		this.tests = [];
		this.queue = {};
		this.queueProgress = 0;
		this.queueLength = 0;
	}

	function addQueueElement(queue, test) {
		queue.push(test);
	}

	proto = {
		/**
		 * Start running tests from prepared queue
		 * @param {Function} doneCallback Function called after all the tests are done
		 */
		run: function (doneCallback) {
			this.doneCallback = doneCallback;

			// Initialize basic object for collecting information
			// about currently running testing process
			this.info = {
				start: 0, // Timestamp
				finish: 0, // Timestamp
				testCount: 0,
				host: {
					hostname: os.hostname(),
					type: os.type(),
					platform: os.platform(),
					arch: os.arch(),
					release: os.release(),
					memory: {
						total: os.totalmem(),
						free: os.freemem()
					},
					cpus: os.cpus()
				},
				targets: {}
			};
		},
		/**
		 * Builds queues for all attached devices
		 * A list of test should be given first.
		 * @param {Array} targets
		 */
		prepareTargetQueues: function (targets) {
			var targetsUIDs,
				addQueue;

			// Creates queues based on attached devices
			// In case no devices list will be given we just assume
			// there is only one queue called "default"
			if (!targets) {
				targetsUIDs = ["default"];
			} else {
				targetsUIDs = targets.map(function (target) {
					return target.uid;
				});
			}

			addQueue = this._addQueue.bind(this);

			targetsUIDs.forEach(addQueue);
		},
		_addQueue: function (targetUID) {
			var self = this,
				addElement;

			self.queue[targetUID] = [];

			addElement = addQueueElement.bind(null, self.queue[targetUID]);

			self.tests.forEach(addElement);

			// This is crucial
			// queueLength is the determination point for ending the testing process
			self.queueLength += self.tests.length;
		},
		runQueue: function () {
			throw "tester.runQueue missing implementation";
		},
		/**
		 * Adds test to test list.
		 * @param {Object} app
		 */
		addTest: function (app) {
			this.tests.push(app);
		},
		addData: function () {
			throw "tester.addData missing implementation";
		},
		/**
		 * Returns the whole object of test results
		 * @return {Object}
		 */
		getRawResults: function () {
			return this.storage;
		},
		/**
		 * Resets tester settings to initial values
		 */
		reset: function () {
			this.storage = {};
			this.tests.length = 0;
			this.queue = {};
			this.queueProgress = 0;
			this.queueLength = 0;
		}
	};

	BaseTester.prototype = proto;

	return BaseTester;
}());
