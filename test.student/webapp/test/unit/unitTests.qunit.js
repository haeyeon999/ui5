/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"syncc20/test.student/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
