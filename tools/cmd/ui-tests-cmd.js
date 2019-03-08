var uiTests = require("./lib/ui-tests"),
	app = "UI-tests",
	profile = "wearable",
	screenshots = require("../../tests/" + app + "/app/" + profile + "/screenshots.json"),
	globalAppId = "1234567999.UITestsWearable",
	device = "540e928b4100cd4e";

/**
 * start UI-Tests
 *
 * 1. Launch UITests app
 * 2. Take screenshots
 * 3. Make image diffs
 *
 */
uiTests.config({
	screenshots: screenshots.filter(item => item.pass),
	app: app,
	profile: profile,
	globalAppId: globalAppId,
	device: device
});
uiTests.run(function () {
	console.log("end");
});