/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"ui5C20/homework1.review/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
