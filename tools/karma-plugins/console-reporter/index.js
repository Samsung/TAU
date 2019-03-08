var ConsoleReporter = function(baseReporterDecorator) {
	baseReporterDecorator(this);
	var colors = require("colors");


	this.onRunComplete = function(browsersCollection, results) {
		this.write("\n-----------------------------------------------------------------------------\n".rainbow);
		this.write("\nSUMMARY:\n".bold.underline.cyan);
		this.write("   - success: " + results.success.toString().green + "\n");
		this.write("   - failed: " + results.failed.toString().red + "\n");
		this.write("\n-----------------------------------------------------------------------------\n\n".rainbow);

	};

}

ConsoleReporter.$inject = ["baseReporterDecorator", "formatError"];

module.exports = {
	"reporter:console": ["type", ConsoleReporter]
};