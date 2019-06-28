/*global module, require, process*/
/*eslint camelcase: 0 */
/**
 * Tasks manager for TAU
 *
 * @author  Maciej Urbanski <m.urbanski@samsung.com>
 * @author  Hyunkook, Cho <hk0713.cho@samsung.com>
 * @author  Hyeoncheol Choi <hc7.choi@samsung.com>
 * @author  Piotr Karny <p.karny@samsung.com>
 * @author  Krzysztof Antoszek <k.antoszek@samsung.com>
 * @author  Tomasz Lukawski <t.lukawski@samsung.com>
 * @author  Junyoung Park <jy-.park@samsung.com>
 * @author  Maciej Moczulski <m.moczulski@samsung.com>
 * @author  Sergiusz Struminski <s.struminski@samsung.com>
 * @author  Heeju Joo <heeju.joo@samsung.com>
 * @author  Michał Szepielak <m.szepielak@samsung.com>
 * @author  Youmin Ha <youmin.ha@samsung.com>
 * @author  Hosup Choi <hosup83.choi@samsung.com>
 * @author  jihoon.o <jihoon.o@samsung.com>
 */
var path = require("path"),
	autoprefixer = require("autoprefixer"),
	async = require("async"),
	webpack = require("webpack"),
	ceconverter = require(path.join(__dirname, "/tools/converter/index")),
	// Rules for jsdoc check
	eslintRules = require("./.eslintrc"),
	jsdocRules = require("./config/.eslintrc.jsdoc.ci");

module.exports = function (grunt) {
	var pkg = grunt.file.readJSON("package.json"),
		themes = grunt.file.readJSON("themes.json"),
		name = pkg.name,
		version = pkg.version,
		themeVersion = ["default", "changeable"],
		// Path to build framework
		dist = "dist",
		src = "src",

		themeConverterXMLPath = path.join("tools", "grunt", "xml"),

		mediaType = grunt.option("media") || "circle",

		// Path to build framework
		wearableAppRoot = path.join("examples/wearable/UIComponentsWorking/"),

		MEDIA_QUERY = {
			"ALL": "all",
			"CIRCLE": "all and (-tizen-geometric-shape: circle)"
		},

		// Path to framework JS sources
		srcJs = path.join(src, "js"),
		srcCss = themes.path,

		tauDebug = grunt.option("tau-debug") || false,
		tauPerformance = grunt.option("tau-performance") || false,

		fwkDirectory = grunt.option("fwk-directory") || "../../fwk/",

		buildRoot = path.join(dist),
		buildDir = {
			mobile: {
				js: path.join(buildRoot, "mobile", "js"),
				theme: path.join(buildRoot, "mobile", "theme")
			},
			wearable: {
				js: path.join(buildRoot, "wearable", "js"),
				theme: path.join(buildRoot, "wearable", "theme")
			},
			tv: {
				js: path.join(buildRoot, "tv", "js"),
				theme: path.join(buildRoot, "tv", "theme")
			}
		},

		rootNamespace = name,
		config = rootNamespace + "Config",
		fileName = name,

		wrapStart = "(function(window, document, undefined) {\n" +
			"'use strict';\n" +
			"var ns = window." + rootNamespace + " = window." + rootNamespace + " || {},\n" +
			"nsConfig = window." + config + " = window." + config + " || {};\n" +
			"nsConfig.rootNamespace = '" + rootNamespace + "';\n" +
			"nsConfig.fileName = '" + fileName + "';\n" +
			"ns.version = '" + version + "';\n",

		wrapEnd = "}(window, window.document));\n",

		externalLibs = [
			"d3.min.js",
			"jquery.flipster.min.js",
			"r-type.min.js",
			"tauCharts.min.js",
			"tauCharts.min.css"
		],

		files = {
			js: {
				minifiedFiles: [],
				setMinifiedFiles: function () {
					files.js.minifiedFiles.length = 0;
					grunt.file.recurse(buildRoot, function (abspath/*, rootdir, subdir, filename */) {
						if (/.js$/.test(abspath) && !/.min.js$/.test(abspath)) {
							files.js.minifiedFiles.push({
								src: abspath,
								dest: abspath.replace(".js", ".min.js")
							});
						}
					});
				},

				getLicenseFiles: function () {
					var exts = [".min.js", ".js"],
						licenseFiles = [],
						device,
						src,
						pushLicenseFile = function (ext) {
							src = path.join(buildDir[device].js, name) + ext;
							licenseFiles.push({
								src: [path.join("license", "Flora") + ".txt", src],
								dest: src
							});
						};

					for (device in buildDir) {
						if (buildDir.hasOwnProperty(device)) {
							exts.forEach(pushLicenseFile);
						}
					}

					return licenseFiles;
				}
			},

			css: {
				getDefault: function (device) {
					var list = themes.device[device],
						i = 0,
						len = list.length,
						theme;

					for (; i < len; i++) {
						theme = list[i];
						if (theme["default"] === "true") {
							return {
								src: path.join(buildRoot, device, "theme", theme.name),
								dest: path.join(buildRoot, device, "theme", "default")
							};
						}
					}
				},

				getLicenseFiles: function (version) {
					var exts = [".css", ".min.css"],
						wearableThemeColors = ["blue", "brown"],
						licenseFiles = [],
						i = 1,
						device,
						list,
						len,
						theme,
						src,
						pushChangableFiles = function (ext) {
							src = path.join(buildDir[device].theme, version, name) + ext;
							licenseFiles.push({
								src: [path.join("license", "Flora") + ".txt", src],
								dest: src
							});
						},
						pushNonChangableFiles = function (ext) {
							src = path.join(buildDir[device].theme, theme.name, name) + ext;
							licenseFiles.push({
								src: [path.join("license", "Flora") + ".txt", src],
								dest: src
							});
						},
						pushWearableFiles = function (ext) {
							len = wearableThemeColors.length;
							for (i = 0; i < len; i++) {
								src = path.join(buildDir[version].theme, wearableThemeColors[i], name) + ext;
								licenseFiles.push({
									src: [path.join("license", "Flora") + ".txt", src],
									dest: src
								});
							}
						};

					for (device in buildDir) {
						if (buildDir.hasOwnProperty(device)) {
							list = themes.device[device];
							len = list.length;

							if (version === "changeable") {
								theme = list[0];
								exts.forEach(pushChangableFiles);
							} else {
								for (; i < len; i++) {
									theme = list[i];
									exts.forEach(pushNonChangableFiles);
								}
							}
						}
					}
					if (version === "wearable") {
						theme = themes.device[version];
						exts.forEach(pushWearableFiles);
					}

					return licenseFiles;
				}
			},

			image: {
				getImageFiles: function (device, version) {
					var rtn = [],
						list = themes.device[device],
						versionPath = version ? version + "-path" : "default-path",
						wearableThemeColors = ["blue", "brown"],
						i = 0,
						len = list.length,
						theme;

					if (version === "changeable") {
						theme = list[0];
						rtn.push({
							expand: true,
							cwd: path.join(srcCss, theme[versionPath], theme.images),
							src: "**",
							dest: path.join(buildRoot, device, "theme", version, theme.images)
						});
					} else {
						for (; i < len; i++) {
							theme = list[i];
							if (theme.name !== "changeable") {
								rtn.push({
									expand: true,
									cwd: path.join(srcCss, theme[versionPath], theme.images),
									src: "**",
									dest: path.join(buildRoot, device, "theme", theme.name, theme.images)
								});
							}
						}
					}
					if (version === "wearable") {
						theme = themes.device[device][0];
						len = wearableThemeColors.length;
						for (i = 0; i < len; i++) {
							rtn.push({
								expand: true,
								cwd: path.join(srcCss, version, "changeable", "theme-changeable", theme.images),
								src: "**",
								dest: path.join(buildRoot, device, "theme", wearableThemeColors[i], theme.images)
							});
						}
					}

					return rtn;
				}
			}
		},

		initConfig = {
			version: version,

			eslint: {
				js: {
					options: {
						rules: {
							camelcase: "off"
						}
					},
					files: {
						src: [path.join(srcJs, "**/*.js"), "Gruntfile.js", "tools/grunt/tasks/**/*.js",
							"!tools/grunt/tasks/templates/**/*.js", "examples/**/*.js", "!examples/**/lib/**/*.js",
							"examples/**/*.html", "examples/**/*.htm"]
					}
				},
				"js-ci": {
					options: {
						format: "junit",
						outputFile: "report/eslint/junit-output.xml"
					},
					files: {
						src: [path.join(srcJs, "**/*.js"), "Gruntfile.js", "tools/grunt/tasks/**/*.js", "examples/**/*.js",
							"!tools/grunt/tasks/templates/**/*.js", "!examples/**/lib/**/*.js", "examples/**/*.html",
							"examples/**/*.htm"]
					}
				},
				single: {
					options: {
						format: "junit",
						reporterOutput: "report/eslint/junit-" + grunt.option("jshintno") + ".xml"
					},
					src: grunt.option("jshintfile")
				},
				dom_munger: {
					circle: {
						options: {
							update: {selector: "link[href*='.circle.']", attribute: "media", value: MEDIA_QUERY.ALL}
						},
						src: path.join(wearableAppRoot, "**/*.html")
					},
					default: {
						options: {
							update: {selector: "link[href*='.circle.']", attribute: "media", value: MEDIA_QUERY.CIRCLE}
						},
						src: path.join(wearableAppRoot, "**/*.html")
					}
				},
				jsdoc: {
					options: {
						plugins: eslintRules.plugins,
						rules: Object.assign({}, eslintRules.rules, jsdocRules.rules),
						settings: Object.assign({}, eslintRules.settings, jsdocRules.settings)
					},
					files: {
						src: [path.join(srcJs, "**/*.js")]
					}
				},
				"jsdoc-ci": {
					options: {
						plugins: jsdocRules.plugins,
						rules: Object.assign({}, eslintRules.rules, jsdocRules.rules),
						settings: jsdocRules.settings,
						format: "junit",
						outputFile: "report/eslint/junit-output-doc.xml"
					},
					files: {
						src: [path.join(srcJs, "**/*.js")]
					}
				}
			},

			lesslint: {
				less: {
					options: {},
					files: {
						src: [
							"src/css/profile/wearable/changeable/theme-changeable/theme.less",
							"src/css/profile/wearable/changeable/theme-changeable/theme.circle.less",
							"src/css/profile/mobile/changeable/theme-changeable/theme.less",
							"src/css/profile/tv/changeable/theme-changeable/theme.less"
						]
					}
				},
				"less-ci": {
					options: {
						csslint: {
							"adjoining-classes": false,
							"overqualified-elements": false,
							"qualified-headings": false,
							"box-sizing": false,
							"fallback-colors": false,
							"known-properties": false
						},
						formatters: [
							{
								id: "junit-xml",
								dest: "report/less/lint.xml"
							}
						]
					},
					files: {
						src: [
							"src/css/profile/wearable/changeable/theme-changeable/theme.less",
							"src/css/profile/wearable/changeable/theme-changeable/theme.circle.less",
							"src/css/profile/mobile/changeable/theme-changeable/theme.less",
							"src/css/profile/tv/changeable/theme-changeable/theme.less"
						]
					}
				}
			},

			// Test module (tools/grunt/tasks/tests.js) add callback for [profileName].options.done
			// If here is something changed, please verify it in tests module also.
			requirejs: {
				wearable: {
					options: {
						baseUrl: srcJs,
						optimize: "none",
						findNestedDependencies: true,
						skipModuleInsertion: true,
						name: "wearable",
						out: path.join(buildDir.wearable.js, name) + ".js",
						pragmas: {
							tauPerformance: !tauPerformance,
							tauMVC: true,
							tauUI: false
						},
						pragmasOnSave: {
							tauBuildExclude: true,
							tauDebug: !tauDebug
						},
						wrap: {
							start: wrapStart,
							end: wrapEnd
						}
					}
				},
				wearableMVC: {
					options: {
						baseUrl: srcJs,
						optimize: "none",
						findNestedDependencies: true,
						skipModuleInsertion: true,
						name: "wearable",
						out: path.join(buildDir.wearable.js, name) + ".mvc.js",
						pragmas: {
							tauPerformance: !tauPerformance,
							tauMVC: false,
							tauUI: true
						},
						pragmasOnSave: {
							tauBuildExclude: true,
							tauDebug: !tauDebug
						},
						wrap: {
							start: wrapStart,
							end: wrapEnd
						}
					}
				},
				wearableFull: {
					options: {
						baseUrl: srcJs,
						optimize: "none",
						findNestedDependencies: true,
						skipModuleInsertion: true,
						name: "wearable",
						out: path.join(buildDir.wearable.js, name) + ".full.js",
						pragmas: {
							tauPerformance: !tauPerformance,
							tauMVC: false,
							tauUI: false
						},
						pragmasOnSave: {
							tauBuildExclude: true,
							tauDebug: !tauDebug
						},
						wrap: {
							start: wrapStart,
							end: wrapEnd
						}
					}
				},

				mobile: {
					options: {
						baseUrl: srcJs,
						optimize: "none",
						findNestedDependencies: true,
						skipModuleInsertion: true,
						name: "mobile",
						out: path.join(buildDir.mobile.js, name) + ".js",
						pragmas: {
							tauPerformance: !tauPerformance,
							tauMVC: true,
							tauUI: false
						},
						pragmasOnSave: {
							tauBuildExclude: true,
							tauDebug: !tauDebug
						},
						wrap: {
							start: wrapStart,
							end: wrapEnd
						}
					}
				},
				mobileMVC: {
					options: {
						baseUrl: srcJs,
						optimize: "none",
						findNestedDependencies: true,
						skipModuleInsertion: true,
						name: "mobile",
						out: path.join(buildDir.mobile.js, name) + ".mvc.js",
						pragmas: {
							tauPerformance: !tauPerformance,
							tauMVC: false,
							tauUI: true
						},
						pragmasOnSave: {
							tauBuildExclude: true,
							tauDebug: !tauDebug
						},
						wrap: {
							start: wrapStart,
							end: wrapEnd
						}
					}
				},
				mobileFull: {
					options: {
						baseUrl: srcJs,
						optimize: "none",
						findNestedDependencies: true,
						skipModuleInsertion: true,
						name: "mobile",
						out: path.join(buildDir.mobile.js, name) + ".full.js",
						pragmas: {
							tauPerformance: !tauPerformance,
							tauMVC: false,
							tauUI: false
						},
						pragmasOnSave: {
							tauBuildExclude: true,
							tauDebug: !tauDebug
						},
						wrap: {
							start: wrapStart,
							end: wrapEnd
						}
					}
				},

				mobile_support: {
					options: {
						baseUrl: srcJs,
						optimize: "none",
						findNestedDependencies: false,
						removeCombined: true,
						skipModuleInsertion: true,
						name: "mobile.support-2.3",
						exclude: [
							"mobile"
						],
						out: path.join(buildDir.mobile.js, name + ".support-2.3") + ".js",
						pragmas: {
							tauPerformance: !tauPerformance,
							tauMVC: true,
							tauUI: false
						},
						pragmasOnSave: {
							tauBuildExclude: true,
							tauDebug: !tauDebug
						},
						wrap: {
							start: wrapStart,
							end: wrapEnd
						}
					}
				},

				tv: {
					options: {
						baseUrl: srcJs,
						optimize: "none",
						findNestedDependencies: true,
						skipModuleInsertion: true,
						name: "tv",
						out: path.join(buildDir.tv.js, name) + ".js",
						pragmas: {
							tauPerformance: !tauPerformance,
							tauMVC: true,
							tauUI: false
						},
						pragmasOnSave: {
							tauBuildExclude: true,
							tauDebug: !tauDebug
						},
						wrap: {
							start: wrapStart,
							end: wrapEnd
						}
					}
				},

				unit_test: {
					options: {
						baseUrl: srcJs,
						optimize: "none",
						findNestedDependencies: true,
						skipModuleInsertion: true,
						out: path.join(buildRoot, "unit", "tau.js"),
						include: [
							"core/event"
						],
						pragmas: {
							tauPerformance: !tauPerformance,
							tauMVC: true,
							tauUI: false
						},
						pragmasOnSave: {
							tauBuildExclude: true,
							tauDebug: !tauDebug
						},
						wrap: {
							start: wrapStart,
							end: wrapEnd
						}
					}
				}
			},

			less: {
				wearable: {
					files: [
						{
							src: path.join(srcCss, "wearable", "changeable", "theme-changeable", "theme.less"),
							dest: path.join(buildRoot, "wearable", "theme", "changeable", "tau.template")
						},
						{
							src: path.join(srcCss, "wearable", "changeable", "theme-changeable", "theme.circle.less"),
							dest: path.join(buildRoot, "wearable", "theme", "changeable", "tau.circle.template")
						}
					]
				},
				mobile: {
					files: [
						{
							src: path.join(srcCss, "mobile", "changeable", "theme-changeable", "theme.less"),
							dest: path.join(buildRoot, "mobile", "theme", "changeable", "tau.template")
						}
					]
				},
				mobile_support: {
					files: [
						{
							src: path.join(srcCss, "mobile", "changeable", "theme-changeable", "theme.less"),
							dest: path.join(buildRoot, "mobile", "theme", "changeable", "tau.template")
						},
						{
							src: path.join("src", "css", "support", "mobile", "changeable", "theme-changeable", "theme.support-2.3.less"),
							dest: path.join(buildRoot, "mobile", "theme", "changeable", "tau.support-2.3.template")
						}
					]
				},
				mobile_iot: {
					files: [
						{
							src: path.join(srcCss, "mobile", "changeable", "iot", "iot.less"),
							dest: path.join(buildRoot, "mobile", "theme", "changeable", "tau.iot.template")
						}
					]
				},
				tv: {
					files: [
						{
							src: path.join(srcCss, "mobile", "changeable", "theme-changeable", "theme.less"),
							dest: path.join(buildRoot, "tv", "theme", "changeable", "tau.template")
						},
						{
							src: path.join(srcCss, "tv", "changeable", "theme-changeable", "theme.less"),
							dest: path.join(buildRoot, "tv", "theme", "changeable", "tau.tv.template")
						}
					]
				},
				examples: {
					files: [{
						expand: true,
						cwd: "examples/wearable/UIComponentsWorking/",
						src: "**/*.html",
						dest: "examples/wearable/UIComponentsWorking/"
					}],
					options: {
						replacements: [
							{
								pattern: /\<link rel=\"stylesheet\" href=\"(.*)lib\/tau\/wearable\/theme\/default\/tau.css\">/gi,
								replacement: function (fullStr, path) {
									return "<link rel=\"stylesheet\/less\" type=\"text\/css\" href=\"" + path +
										"../../../../src/css/profile/wearable/changeable/theme-changeable/theme.less\" />";
								}
							},
							{
								pattern: /\<link rel=\"stylesheet\" media=\".*\" href=\"(.*)lib\/tau\/wearable\/theme\/default\/tau.circle.css\"\>/gi,
								replacement: function (fullStr, path) {
									return "<link rel=\"stylesheet\/less\" type=\"text\/css\" href=\"" + path +
										"../../../../src/css/profile/wearable/changeable/theme-changeable/theme.circle.less\" /><script src=\"" + path +
										"../../../../libs/less.js\" type=\"text\/javascript\"><\/script>";
								}
							}
						]
					}
				}
			},

			postcss: {
				options: {
					processors: [
						autoprefixer({browsers: "last 10 Samsung versions, last 10 versions, last 10 ChromeAndroid versions"})
					]
				},
				dist: {
					src: path.join(buildRoot, "**", "*.css")
				}
			},

			themeConverter: {
				mobile: {
					createColorMapFile: grunt.option("generate-colormap") || false,
					options: {
						index: "0",
						style: "Dark",
						inputColorTableXML: path.join(themeConverterXMLPath, "mobile", "InputColorTable.xml"),
						changeableColorTableXML: path.join(themeConverterXMLPath, "mobile", "ChangeableColorTable1.xml")
					},
					files: [
						{
							src: path.join(buildDir.mobile.theme, "changeable", "tau.template"),
							dest: path.join(buildDir.mobile.theme, "changeable", "tau.css")
						}
					]
				},
				mobile_support: {
					createColorMapFile: grunt.option("generate-colormap") || false,
					options: {
						index: "0",
						style: "Dark",
						inputColorTableXML: path.join(themeConverterXMLPath, "mobile", "InputColorTable.xml"),
						changeableColorTableXML: path.join(themeConverterXMLPath, "mobile", "ChangeableColorTable1.xml")
					},
					files: [
						{
							src: path.join(buildDir.mobile.theme, "changeable", "tau.template"),
							dest: path.join(buildDir.mobile.theme, "changeable", "tau.css")
						},
						{
							src: path.join(buildDir.mobile.theme, "changeable", "tau.support-2.3.template"),
							dest: path.join(buildDir.mobile.theme, "changeable", "tau.support-2.3.css")
						}
					]
				},
				mobile_iot: {
					createColorMapFile: grunt.option("generate-colormap") || false,
					options: {
						index: "0",
						style: "Dark",
						inputColorTableXML: path.join(themeConverterXMLPath, "mobile", "InputColorTable.xml"),
						changeableColorTableXML: path.join(themeConverterXMLPath, "mobile", "ChangeableColorTable1.xml")
					},
					files: [
						{
							src: path.join(buildDir.mobile.theme, "changeable", "tau.iot.template"),
							dest: path.join(buildDir.mobile.theme, "changeable", "tau.iot.css")
						}
					]
				},
				tv: {
					createColorMapFile: grunt.option("generate-colormap") || false,
					options: {
						index: "0",
						style: "Dark",
						inputColorTableXML: path.join(themeConverterXMLPath, "mobile", "InputColorTable.xml"),
						changeableColorTableXML: path.join(themeConverterXMLPath, "mobile", "ChangeableColorTable1.xml")
					},
					files: [
						{
							src: path.join(buildDir.tv.theme, "changeable", "tau.template"),
							dest: path.join(buildDir.tv.theme, "changeable", "tau.css")
						},
						{
							src: path.join(buildDir.tv.theme, "changeable", "tau.tv.template"),
							dest: path.join(buildDir.tv.theme, "changeable", "tau.tv.css")
						}
					]
				},
				wearable: {
					createColorMapFile: grunt.option("generate-colormap") || false,
					options: {
						index: "0",
						style: "Dark",
						inputColorTableXML: path.join(themeConverterXMLPath, "wearable", "blue", "InputColorTable.xml"),
						changeableColorTableXML: path.join(themeConverterXMLPath, "wearable", "blue", "ChangeableColorTable1.xml")
					},
					files: [
						{
							src: path.join(buildDir.wearable.theme, "changeable", "tau.template"),
							dest: path.join(buildDir.wearable.theme, "changeable", "tau.css")
						},
						{
							src: path.join(buildDir.wearable.theme, "changeable", "tau.template"),
							dest: path.join(buildDir.wearable.theme, "blue", "tau.css")
						}
					]
				},
				wearable_circle: {
					options: {
						index: "0",
						style: "Dark",
						inputColorTableXML: path.join(themeConverterXMLPath, "wearable", "circle", "InputColorTable.xml"),
						changeableColorTableXML: path.join(themeConverterXMLPath, "wearable", "circle", "ChangeableColorTable1.xml")
					},
					src: path.join(buildDir.wearable.theme, "changeable", "tau.circle.template"),
					dest: path.join(buildDir.wearable.theme, "changeable", "tau.circle.css")
				},
				wearable_old: {
					options: {
						index: "0",
						style: "Dark",
						inputColorTableXML: path.join(themeConverterXMLPath, "wearable", "brown", "InputColorTable.xml"),
						changeableColorTableXML: path.join(themeConverterXMLPath, "wearable", "brown", "ChangeableColorTable1.xml")
					},
					src: path.join(buildDir.wearable.theme, "changeable", "tau.template"),
					dest: path.join(buildDir.wearable.theme, "brown", "tau.css")
				},

				wearable_examples: {
					createColorMapFile: false,
					options: {
						index: "0",
						style: "Dark",
						inputColorTableXML: path.join(themeConverterXMLPath, "wearable", "blue", "InputColorTable.xml"),
						changeableColorTableXML: path.join(themeConverterXMLPath, "wearable", "blue", "ChangeableColorTable1.xml")
					},
					files: [
						{
							src: "src/css/profile/wearable/changeable/theme-changeable/theme.color.less",
							dest: "src/css/profile/wearable/changeable/theme-changeable/theme.color.converted.less"
						},
						{
							src: "src/css/profile/wearable/changeable/theme-circle/theme.changeable.less",
							dest: "src/css/profile/wearable/changeable/theme-circle/theme.changeable.converted.less"
						}
					]
				}
			},

			uglify: {
				options: {
					beautify: {
						ascii_only: true
					},
					compress: {
						drop_console: true
					}
				},

				all: {
					files: files.js.minifiedFiles
				}
			},

			cssmin: {
				options: {
					keepSpecialComments: 0
				},

				all: {
					files: [{
						expand: true,
						cwd: buildRoot,
						src: ["**/*.css", "!**/*.min.css"],
						dest: buildRoot,
						rename: function (dest, src) {
							var folder = src.substring(0, src.lastIndexOf("/")),
								filename = src.substring(src.lastIndexOf("/"), src.length);

							filename = filename.substring(0, filename.lastIndexOf("."));

							return dest + "/" + folder + filename + ".min.css";
						}
					}]
				},

				changeable: {
					expand: true,
					cwd: buildRoot,
					src: ["**/*.template"],
					dest: buildRoot,
					rename: function (dest, src) {
						var folder = src.substring(0, src.lastIndexOf("/")),
							filename = src.substring(src.lastIndexOf("/"), src.length);

						filename = filename.substring(0, filename.lastIndexOf("."));

						return dest + "/" + folder + filename + ".min.template";
					}
				}
			},

			copy: {
				examples: {
					files: [{
						expand: true,
						cwd: "examples/wearable/UIComponents/",
						src: "**/*",
						dest: "examples/wearable/UIComponentsWorking/"
					}]
				},
				wearableChangeableImages: {
					files: files.image.getImageFiles("wearable", "changeable")
				},

				wearableColorThemeImages: {
					files: files.image.getImageFiles("wearable", "wearable")
				},

				mobileChangeableImages: {
					files: files.image.getImageFiles("mobile", "changeable")
				},

				tvChangeableImages: {
					files: files.image.getImageFiles("tv", "changeable")
				},

				mobileJquery: {
					files: [
						{
							src: "libs/jquery.js",
							dest: path.join(buildDir.mobile.js, "jquery.js")
						},
						{
							src: "libs/jquery.min.js",
							dest: path.join(buildDir.mobile.js, "jquery.min.js")
						}
					]
				},

				wearableJquery: {
					files: [
						{
							src: "libs/jquery.js",
							dest: path.join(buildDir.wearable.js, "jquery.js")
						},
						{
							src: "libs/jquery.min.js",
							dest: path.join(buildDir.wearable.js, "jquery.min.js")
						}
					]
				},

				tvJquery: {
					files: [
						{
							src: "libs/jquery.js",
							dest: path.join(buildDir.tv.js, "jquery.js")
						},
						{
							src: "libs/jquery.min.js",
							dest: path.join(buildDir.tv.js, "jquery.min.js")
						}
					]
				},

				license: {
					src: "LICENSE.Flora",
					dest: path.join(dist, "LICENSE") + ".Flora"
				},

				animation: {
					files: [
						{
							expand: true,
							cwd: "libs/animation/",
							src: "**",
							dest: path.join(dist, "animation/")
						}
					]
				},

				"external-libs": {
					files: externalLibs.map((libPath) => ({
						src: `libs/${libPath}`,
						dest: path.join(dist, "libs", libPath)
					}))
				},

				"sdk-docs": {
					files: [
						{expand: true, cwd: "tools/grunt/tasks/templates/sdk/files", src: "**/*", dest: "docs/sdk/mobile/html"},
						{expand: true, cwd: "tools/grunt/tasks/templates/sdk/files", src: "**/*", dest: "docs/sdk/wearable/html"},
						{expand: true, cwd: "tools/grunt/tasks/templates/sdk/files", src: "**/*", dest: "docs/sdk/tv/html"}
					]
				},

				"components": {
					files: [
						{expand: true, cwd: "tools/grunt/tasks/templates/components/files", src: "**/*", dest: "docs/components/wearable"}
					]
				},

				"components-images": {
					files: [
						{expand: true, cwd: "src/", src: "images/*", dest: "docs/components/wearable/components/"}
					]
				},
				"fwk": {
					files: [
						{expand: true, cwd: "docs/components/wearable", src: "**/*", dest: fwkDirectory + "/tau-component-packages" }
					]
				}

			},

			licenseCss: {
				default: {
					files: files.css.getLicenseFiles("default")
				},
				changeable: {
					files: files.css.getLicenseFiles("changeable")
				}
			},

			"ej-namespace": {
				//the task added in tests.js used for tests
			},

			symlink: {
				options: {
					overwrite: false
				},

				wearableDefaultTheme: files.css.getDefault("wearable", "default"),

				mobileDefaultTheme: files.css.getDefault("mobile", "default"),

				tvDefaultTheme: files.css.getDefault("tv", "default")
			},

			"developer-guide-extract": {
				core: {
					files: [{
						src: ["src/js/core/**/*.js"],
						dest: "docs/guide/source/inline/core/",
						// Part of the path removed in destination
						destBase: "src/js/core/"
					}]
				},
				wearable: {
					files: [{
						src: ["src/js/profile/wearable/**/*.js"],
						dest: "docs/guide/source/inline/wearable/",
						// Part of the path removed in destination
						destBase: "src/js/profile/wearable/"
					}]
				},
				mobile: {
					files: [{
						src: "src/js/profile/mobile/**/*.js",
						dest: "docs/guide/source/inline/mobile/",
						// Part of the path removed in destination
						destBase: "src/js/profile/mobile/"
					}]
				}
			},

			"developer-guide-build": {
				"options": {
					"version": version,
					"sourceDir": "docs/guide/source",
					"destinationDir": "docs/guide/built",
					"sourceMarkdown": ["**/*.md"],
					"sourceResources": [
						"**/*.html",
						"**/*.js",
						"**/*.png",
						"**/*.jpg",
						"**/*.zip",
						"**/*.css",
						"**/*.ttf",
						"**/*.wot",
						"**/*.svg",
						"**/*.woff"
					]
				}
			},

			"remove-unused": {
				"images": {
					resourcesPath: "src/css",
					imageFiles: [
						"src/css/**/*.png",
						"src/css/**/*.jpg",
						"src/css/**/*.jpeg"
					],
					// Finding css files instead of less will ensure that every custom created filename will be
					// present in the output
					codeFiles: [
						"dist/**/*.css"
					]
				}
			},

			"string-replace": {
				examples: {
					files: [{
						expand: true,
						cwd: "SDK/wearable/UIComponents/",
						src: "**/*.html",
						dest: "SDK/wearable/UIComponentsWorking/"
					}],
					options: {
						replacements: [
							{
								pattern: /\<script src=\"(.*)lib\/tau\/wearable\/js\/tau.js\"><\/script>/gi,
								replacement: function (fullStr, path) {
									return "<script src=\"" + path + "../../../libs/less.js\" type=\"text\/javascript\"></script>" +
									"<script type=\"text/javascript\" src=\"" + path +
										"../../../libs/require.js\" data-main=\"" + path +
										"../../../src/js/wearable.js\"></script>";
								}
							}
						]
					}
				},
				examples_less: {
					files: [{
						expand: true,
						cwd: "examples/wearable/UIComponentsWorking/",
						src: "**/*.html",
						dest: "examples/wearable/UIComponentsWorking/"
					}],
					options: {
						replacements: [
							{
								pattern: /\<link rel=\"stylesheet\" href=\"(.*)lib\/tau\/wearable\/theme\/default\/tau.css\">/gi,
								replacement: function (fullStr, path) {
									return "<link rel=\"stylesheet\/less\" type=\"text\/css\" href=\"" + path +
										"../../../src/css/profile/wearable/changeable/theme-changeable/theme.less\" />";
								}
							},
							{
								pattern: /\<link rel=\"stylesheet\" media=\".*\" href=\"(.*)lib\/tau\/wearable\/theme\/default\/tau.circle.css\"\>/gi,
								replacement: function (fullStr, path) {
									return "<link rel=\"stylesheet\/less\" type=\"text\/css\" href=\"" + path +
										"../../../src/css/profile/wearable/changeable/theme-changeable/theme.circle.less\" /><script src=\"" + path +
										"../../../libs/less.js\" type=\"text\/javascript\"><\/script>";
								}
							}
						]
					}
				},
				jsduck: {
					files: {
						"tmp/jsduck/": "dist/**/tau.js"
					},
					options: {
						replacements: [
							{
								pattern: /.*\@namespace.*/gi,
								replacement: ""
							},
							{
								pattern: /.*\@instance.*/ig,
								replacement: ""
							},
							{
								pattern: /.*\@expose.*/ig,
								replacement: ""
							},
							{
								pattern: /.*\@internal.*/ig,
								replacement: ""
							},
							{
								pattern: /.*\@example.*/ig,
								replacement: ""
							},
							{
								pattern: /.*\@page.*/ig,
								replacement: ""
							},
							{
								pattern: /.*\@title.*/ig,
								replacement: ""
							},
							{
								pattern: /.*\@seeMore.*/ig,
								replacement: ""
							}
						]
					}
				}
			},

			concat: {
				licenseJs: {
					files: files.js.getLicenseFiles()
				},
				licenseDefaultCss: {
					files: files.css.getLicenseFiles("default")
				},
				licenseChangeableCss: {
					files: files.css.getLicenseFiles("changeable")
				},
				licenseWearableCss: {
					files: files.css.getLicenseFiles("wearable")
				}
			},

			clean: {
				js: [buildDir.mobile.js, buildDir.wearable.js, "dist/animation/*"],
				theme: [buildDir.mobile.theme, buildDir.wearable.theme, buildDir.tv.theme],
				docs: {
					expand: true,
					src: ["docs/sdk", "docs/js"]
				},
				tmp: {
					expand: true,
					src: ["tmp"]
				},
				guide: {
					expand: true,
					src: ["docs/guide/built", "docs/guide/source/inline"]
				}
			},

			qunit: {
				options: {
					"--web-security": "no",
					timeout: 10000
				},
				"unit-docs": [
					"tests/docs/unit/all.html"
				]
			},

			qunit_junit: {},

			"qunit-tap": {},

			"docs-html": {
				mobile: {
					profile: "mobile",
					template: "sdk",
					version: version,
					files: {
						src: ["dist/mobile/js/tau.js"]
					}
				},
				mobile_support: {
					profile: "mobile_support",
					template: "sdk",
					version: version,
					files: {
						src: ["dist/mobile/js/tau.support-2.3.js"]
					}
				},
				wearable: {
					profile: "wearable",
					template: "sdk",
					version: version,
					files: {
						src: ["dist/wearable/js/tau.js"]
					}
				},
				"wearable-components": {
					profile: "wearable",
					template: "components",
					version: version,
					files: {
						src: ["dist/wearable/js/tau.js"]
					}
				}
			},

			"analize-docs": {
				mobile: {
					profile: "mobile"
				},
				mobile_support: {
					profile: "mobile_support"
				},
				wearable: {
					profile: "wearable"
				},
				"wearable-components": {
					profile: "wearable-components"
				}
			},

			watch: {
				options: {
					// Start a live reload server on the default port 35729
					livereload: true,
					interrupt: true
				},

				js: {
					files: ["src/js/**/*.js"],
					tasks: ["requirejs"]
				},

				css: {
					files: ["src/css/**/*.less", "src/css/**/*.png"],
					tasks: ["css"]
				}

			},

			debug: {
				options: {
					open: true
				}
			},

			performance: {

			},

			multitau: {
				options: {
					src: "dist"
				}
			}
		};

	grunt.initConfig(initConfig);

	grunt.registerTask("version", "create version files.", function () {
		grunt.file.write(path.join(dist, "VERSION"), pkg.version + "\n");
	});

	grunt.registerTask("findFiles", "initialize target files.", function (name) {
		var obj = files;

		name = name.split(".");
		name.forEach(function (key) {
			obj = obj[key];
		});
		obj();
	});

	grunt.registerTask("jsduck", ["clean:tmp", "clean:docs", "string-replace:jsduck", "jsduckDocumentation"]);

	function runJSDuck(profile, callback) {
		var cmd = "jsduck",
			src = [path.join("tmp", "jsduck", "dist", profile, "js")],
			dest = path.join("docs", "jsduck", profile),
			args,
			environmentClasses = ["DocumentFragment", "CustomEvent",
				"HTMLUListElement", "HTMLOListElement", "HTMLCollection",
				"HTMLBaseElement", "HTMLImageElement", "WebGLRenderingContext",
				"HTMLSelectElement", "HTMLInputElement", "CSSRule",
				"WebGLProgram", "jQuery", "DOMTokenList", "HTMLLinkElement",
				"HTMLScriptElement", "HTMLCanvasElement", "MouseEvent", "TouchEvent",
				"HTMLHeadElement", "HTMLInputElement", "HTMLButtonElement",
				"jQuery.Event",
				"mat2", "mat3", "mat4", "vec2", "vec3", "vec4", "quat4"],
			jsduck;

		if (!grunt.file.exists("docs")) {
			grunt.file.mkdir("docs");
		}
		if (!grunt.file.exists(path.join("docs", "jsduck"))) {
			grunt.file.mkdir(path.join("docs", "jsduck"));
		}
		if (!grunt.file.exists(path.join("docs", "jsduck", profile))) {
			grunt.file.mkdir(path.join("docs", "jsduck", profile));
		}

		args = src.concat([
			"--title=" + name.toUpperCase() + " - " + version,
			"--eg-iframe=./tools/jsduck/" + profile + "-preview.html",
			"--external=" + environmentClasses.join(","),
			"--output", dest
		]);

		grunt.verbose.writeflags(args, "Arguments");

		jsduck = grunt.util.spawn({
			cmd: cmd,
			args: args
		}, function (error, result, code) {
			grunt.file.delete(path.join("tmp", "jsduck", "dist", profile, "js"), {force: true});
			if (code === 127) {   // "command not found"
				return grunt.warn(
					"You need to have Ruby and JSDuck installed and in your PATH for " +
					"this task to work. " +
					"See https://github.com/dpashkevich/grunt-jsduck for details."
				);
			}
			callback(error);
		});

		jsduck.stdout.pipe(process.stdout);
		jsduck.stderr.pipe(process.stderr);
	}

	grunt.registerTask("jsduckDocumentation", "Compile JSDuck documentation", function () {
		var done = this.async();

		async.series([
			runJSDuck.bind(null, "mobile"),
			runJSDuck.bind(null, "wearable")
		], done);
	});

	// add requirejs tasks to build themes.
	(function () {

		var requirejs = initConfig.requirejs,
			profileName,
			source,
			themeName;

		function defineRequireForTheme(theme) {
			var ver;

			for (ver in themeVersion) {
				if (themeVersion.hasOwnProperty(ver)) {
					if (themeVersion[ver] === "changeable") {
						theme = themes["device"][profileName][0];
						themeName = "changeable";
					} else {
						themeName = theme.name;
					}

					source = path.join("..", "css", "profile", profileName, themeVersion[ver], "theme-" + theme.name, "theme");
					if (grunt.file.exists(path.join(srcJs, source + ".js"))) {
						requirejs["themejs_" + profileName + "_" + themeVersion[ver] + "_" + theme.name] = {
							options: {
								baseUrl: srcJs,
								optimize: "none",
								skipModuleInsertion: true,
								exclude: [profileName],
								name: path.join("..", "css", "profile", profileName, themeVersion[ver], "theme-" + theme.name, "theme"),
								out: path.join(buildDir[profileName].theme, themeName, "theme") + ".js",
								pragmas: {
									tauPerformance: true
								},
								pragmasOnSave: {
									tauBuildExclude: true,
									tauDebug: true
								},
								wrap: {
									start: "(function (ns) {",
									end: "}(tau));"
								}
							}
						};
					}
				}
			}
		}

		for (profileName in themes["device"]) {
			if (themes["device"].hasOwnProperty(profileName)) {
				themes["device"][profileName].forEach(defineRequireForTheme);
			}
		}
	})();

	function themesjs(profile) {
		var task;

		profile = profile || "";

		for (task in initConfig.requirejs) {
			if (initConfig.requirejs.hasOwnProperty(task) && task.indexOf("themejs_" + profile) !== -1) {
				grunt.task.run("requirejs:" + task);
			}
		}
	}

	function createBundleProfile(profile, callback) {
		const distJs = path.join(__dirname, dist, profile, "js");

		webpack({
			mode: "production",
			entry: ["jquery.min.js"].concat(externalLibs)
				.map((lib) => "./" + path.join("libs", lib))
				.concat([path.join(distJs, "tau.min.js")])
				.map((src) => {
					if (src.endsWith(".js")) {
						return `script-loader!${src}`;
					} else {
						return src;
					}
				}),
			output: {
				path: distJs,
				filename: "tau.bundle.js"
			},
			module: {
				rules: [
					{
						test: /\.css$/,
						use: ["style-loader", "css-loader"]
					}
				]
			},
			performance: {
				hints: false
			}
		}, (err, stats) => {
			if (err) {
				return callback(err);
			}
			if (stats.hasErrors() || stats.hasWarnings()) {
				return callback(new Error(stats.toString()));
			}
			callback(null, true);
		});
	}

	function createBundle(profile) {
		const done = this.async(),
			profiles = profile ? [profile] : ["tv", "mobile", "wearable"];

		async.parallel(profiles.map((p) => createBundleProfile.bind(null, p)), done);
	}

	grunt.initConfig(initConfig);

	// npm tasks
	grunt.loadNpmTasks("grunt-dom-munger");
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-requirejs");
	grunt.loadNpmTasks("grunt-eslint");
	grunt.loadNpmTasks("grunt-lesslint");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-less");
	grunt.loadNpmTasks("grunt-contrib-cssmin");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-string-replace");
	grunt.loadNpmTasks("grunt-contrib-symlink");
	grunt.loadNpmTasks("grunt-debug-task");
	grunt.loadNpmTasks("grunt-postcss");

	grunt.loadTasks("tools/grunt/tasks");

	grunt.registerTask("dev", ["dom_munger:" + mediaType]);
	grunt.registerTask("release", ["dom_munger:default"]);

	grunt.registerTask("prepare-working", ["copy:examples", "string-replace:examples", "string-replace:examples_less", "dom_munger:circle",
		"themeConverter:wearable_examples"]);

	grunt.loadTasks("tools/app/tasks");

	// Task list
	grunt.registerTask("themesjs", "Generate themes files using requirejs", themesjs);  // Generate separate themes files
	grunt.registerTask("lint", "Validate code", [
		"eslint:js"
		/*"eslint:jsdoc" jsdoc issues are reported only into CI process, enable this task after fix all jsdoc issues*/
	]);
	grunt.registerTask("jsmin", "Minify JS files", [
		"findFiles:js.setMinifiedFiles",
		"uglify"
	]);
	grunt.registerTask("image-changeable", [
		"copy:wearableChangeableImages",
		"copy:wearableColorThemeImages",
		"copy:mobileChangeableImages",
		"copy:tvChangeableImages"
	]);

	grunt.registerTask("css", "Prepare full CSS for whole project", [
		"clean:theme",
		"less",
		"themeConverter:mobile",
		"themeConverter:mobile_support",
		"themeConverter:mobile_iot",
		"themeConverter:wearable",
		"themeConverter:wearable_circle",
		"themeConverter:wearable_old",
		"themeConverter:tv",
		"cssmin",
		"image-changeable",
		"symlink",
		"postcss"
	]);

	grunt.registerTask("css-mobile", "Prepare CSS for mobile profile", [
		"clean:theme",
		"less:mobile",
		"themeConverter:mobile",
		"cssmin",
		"copy:mobileChangeableImages",
		"symlink:mobileDefaultTheme",
		"postcss"
	]);

	grunt.registerTask("css-mobile_iot", "Prepare CSS for mobile iot profile", [
		"clean:theme",
		"less:mobile_iot",
		"themeConverter:mobile_iot",
		"cssmin",
		"copy:mobileChangeableImages",
		"symlink:mobileDefaultTheme",
		"postcss"
	]);

	grunt.registerTask("css-mobile_support", "Prepare CSS for mobile 2.3 version", [
		"clean:theme",
		"less:mobile_support",
		"themeConverter:mobile_support",
		"cssmin",
		"copy:mobileChangeableImages",
		"symlink:mobileDefaultTheme",
		"postcss"
	]);

	grunt.registerTask("css-wearable", "Prepare CSS for wearable", [
		"clean:theme",
		"less:wearable",
		"themeConverter:wearable",
		"themeConverter:wearable_circle",
		"cssmin",
		"copy:wearableChangeableImages",
		"copy:wearableColorThemeImages",
		"symlink:wearableDefaultTheme",
		"postcss"
	]);

	grunt.registerTask("css-tv", "Prepare CSS for mobile tv profile", [
		"clean:theme",
		"less:tv",
		"themeConverter:tv",
		"cssmin",
		"copy:tvChangeableImages",
		"symlink:tvDefaultTheme",
		"postcss"
	]);

	grunt.registerTask("bundle", "Create bundle file", createBundle);

	grunt.registerTask("js", "Prepare JS", [
		"clean:js",
		"requirejs:mobile",
		"requirejs:wearable",
		"requirejs:mobile_support",
		"requirejs:tv",
		"jsmin",
		"themesjs",
		"copy:mobileJquery",
		"copy:wearableJquery",
		"copy:tvJquery",
		"copy:animation",
		"copy:external-libs",
		"bundle"
	]);

	grunt.registerTask("js-mobile", "Prepare JS for mobile", ["clean:js", "requirejs:mobile", "jsmin", "themesjs:mobile", "copy:mobileJquery", "bundle:mobile"]);
	grunt.registerTask("js-mobile_support", "Prepare JS for mobile 2.3", ["clean:js", "requirejs:mobile", "requirejs:mobile_support", "jsmin", "themesjs:mobile", "copy:mobileJquery"]);
	grunt.registerTask("js-wearable", "Prepare JS wearable", ["clean:js", "requirejs:wearable", "jsmin", "themesjs:wearable", "copy:wearableJquery", "bundle:wearable"]);
	grunt.registerTask("js-tv", "Prepare JS tv", ["clean:js", "requirejs:tv", "jsmin", "themesjs:tv", "copy:tvJquery", "bundle:tv"]);
	grunt.registerTask("license", "Add licence information to files", ["concat:licenseJs", "concat:licenseDefaultCss", "concat:licenseChangeableCss", "concat:licenseWearableCss", "copy:license"]);

	grunt.registerTask("docs-mobile", ["js-mobile", "analize-docs:mobile", "copy:sdk-docs"]);
	grunt.registerTask("docs-mobile_support", ["js-mobile_support", "analize-docs:mobile_support", "copy:sdk-docs"]);
	grunt.registerTask("docs-wearable", ["js-wearable", "analize-docs:wearable", "copy:sdk-docs"]);
	grunt.registerTask("docs", ["docs-wearable", "docs-mobile_support", "docs-mobile"]);
	grunt.registerTask("docs-components-wearable", ["js-wearable", "analize-docs:wearable-components", "copy:components", "copy:components-images", "copy:fwk"]);
	grunt.registerTask("docs-components", ["docs-components-wearable"]);

	grunt.registerTask("build", "Build whole project", [
		"css",
		"js",
		"license",
		"version"
	]);

	grunt.registerTask("build-mobile", "Build mobile project", [
		"css-mobile",
		"js-mobile",
		"license",
		"version"
	]);

	grunt.registerTask("build-mobile_support", "Build mobile project for 2.3", [
		"css-mobile_support",
		"js-mobile_support",
		"license",
		"version"
	]);

	grunt.registerTask("build-wearable", "Build wearable project", ["css-wearable", "js-wearable", "license", "version"]);

	grunt.registerTask("release", "Build, est and prepare docs", ["lint", "build", "test:mobile", "test:mobile_support", "test:jqm", "test:jqm14ok", "test:wearable"]);

	//convert to CE
	grunt.registerTask("convert-app", "Replace html tags with custom elements, example: grunt convert-app:full path to source:full path to destination:profile", function (sourcePath, targetPath, profile) {
		profile = profile || "mobile";

		//convert application
		ceconverter(sourcePath, targetPath, profile);
	});

	grunt.registerTask("ce-test-mobile", ["build",
		"multitau:UIComponentsMobile",
		"multitau:UIComponentsCEMobile",
		"karma:CEUIComponentsMobile"]);

	grunt.registerTask("ce-test-wearable", ["build",
		"multitau:UIComponentsWearable",
		"multitau:UIComponentsCEWearable",
		"karma:CEUIComponentsWearable"]);

	grunt.registerTask("ce-test-wearable-circular", ["build",
		"multitau:UIComponentsWearableCircular",
		"multitau:UIComponentsCEWearableCircular",
		"karma:CEUIComponentsWearableCircular"]);

	grunt.registerTask("apptest", ["build",
		"multitau:TAUControllerWithRouterMobile",
		"multitau:TAUControllerWithOutRouterMobile",
		"multitau:TAUControllerWithOutRouterWithPolymerMobile",
		"multitau:TAUMultiProfilesTemplateLoadMobile",
		"multitau:TAUApplicationFrameworkMobile",
		"karma:app",
		"multitau:TAUControllerWithRouterWearable",
		"multitau:TAUControllerWithOutRouterWearable",
		"multitau:TAUControllerWithOutRouterWithPolymerWearable",
		"multitau:TAUMultiProfilesTemplateLoadWearable",
		"multitau:TAUApplicationFrameworkWearable",
		"karma:app"]);

	grunt.registerTask("verify", [
		"apptest",
		"ce-test-mobile",
		"ce-test-wearable",
		"test"
	]);
	grunt.registerTask("default", "->release", ["release"]);
	grunt.registerTask("ci", "Code style validation for CI", ["eslint:js-ci", "lesslint:less-ci", "eslint:jsdoc-ci"]);
};
