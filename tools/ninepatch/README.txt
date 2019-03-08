========================================================
How to convert css from nine-patch image files.
========================================================

1. Install node-canvas dependencies.

	$ sudo apt-get update
	$ sudo apt-get install libcairo2-dev libjpeg8-dev libpango1.0-dev libgif-dev build-essential g++

You can see more information;
	* https://github.com/learnboost/node-canvas
	* https://github.com/LearnBoost/node-canvas/wiki/_pages


2. Install node modules.

	$ninepatch npm install


3. Put image that you want to converting in [theme]/nine-patch.

	$ cp XXX.9.png src/css/profile/[profile]/[theme-XXX]/nine-patch


4. Run grunt.

	$ninepatch grunt

This task does followings;
	* Create a 9-patch.less file in each theme folder.
		$ src/css/profile/[profile]/[theme-XXX]/9-patch.less
	* Create image files that is removed nine-patch in each theme image folder.
		$ src/css/profile/[profile]/[theme-XXX]/images/nine-patch


5. Use less file in theme folder

	$ vi src/css/profile/[profile]/[theme-XXX]/theme.less
	$ @import "9-patch.less";


6. Live editing

	* run grunt watch mode in root folder.

		$tau grunt watch

	* run grunt watch mode in ninepatch folder.

		$ninepatch grunt watch

	* repeat step 3.
