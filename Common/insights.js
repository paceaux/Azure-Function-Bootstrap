const appInsights = require('applicationinsights');

let client = appInsights.defaultClient;
const { insights } = require('../config/');

function initialize() {
	const { instrumentationKey } = insights;

	if (!instrumentationKey) return;

	appInsights.setup(instrumentationKey)
		.setAutoDependencyCorrelation(true)
		.setAutoCollectRequests(true)
		.setAutoCollectPerformance(true)
		.setAutoCollectExceptions(true)
		.setAutoCollectDependencies(true)
		.setAutoCollectConsole(true)
		.setUseDiskRetryCaching(true)
		.start();

	client = appInsights.defaultClient;
}

module.exports = {
	initialize,
	client,
	appInsights,
	getClient() {
		return appInsights.defaultClient;
	}
};
