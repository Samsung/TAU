#!/usr/bin/env node

/*eslint camelcase: 0 */
var Jenkins = require("jenkins"),
	jenkins = Jenkins({baseUrl: "http://sample:sample@10.113.63.84:8080/"});

function waitForFinish(finishCallback) {
	jenkins.queue.list(function (err, data) {
		if (err) {
			throw err;
		}
		if (data.length === 0) {
			finishCallback();
		} else {
			setTimeout(waitForFinish.bind(null, finishCallback), 5000);
		}
	});
}

jenkins.job.build({
	name: "online_sample_upload_to_spin",
	parameters: {
		sample_git_path: "apps/wearable/web/sample/wearable-widget-sample",
		branch_name: "tizen_3.0"
	}
}, function () {
	waitForFinish(function () {
		jenkins.job.build({
			name: "online_sample_upload_to_spin",
			parameters: {
				sample_git_path: "apps/mobile/web/sample/tizen-winset",
				branch_name: "tizen_3.0"
			}
		}, function () {
			waitForFinish(function () {
				jenkins.job.build({
					name: "online_sample_copy_to_stable",
					parameters: {
						snapshot_name: "apps/wearable/web/sample/wearable-widget-sample",
						sample_list: "apps/wearable/web/sample/wearable-widget-sample,tizen_3.0"
					}
				}, function () {
					waitForFinish(function () {
						jenkins.job.build({
							name: "online_sample_copy_to_stable",
							parameters: {
								snapshot_name: "apps/mobile/web/sample/tizen-winset",
								sample_list: "apps/mobile/web/sample/tizen-winset,tizen_3.0"
							}
						}, function () {
						});
					});
				});
			});
		});
	});
});