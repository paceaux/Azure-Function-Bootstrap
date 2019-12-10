const appInsights = require('../Common/insights');

appInsights.initialize();

const client = appInsights.getClient();

/* IF WEBHOOK
const { postHttp } = require('../Common/httpService');
*/
const { AzureLog, AzureLogError } = require('../Common/utils');

module.exports = function azureFunctionMain(context, timerInfo) {
	const { invocationId } = context.executionContext;
	client.trackEvent({
		name: 'timerTriggerJob:beforeTimerProcessingItem',
		properties: { timerItem: timerInfo, invocationId }
	});
	AzureLog('Timer was triggered', context);
	AzureLog(timerInfo, context);

	if (timerInfo.IsPastDue) {
		AzureLogError('Timer is passed due', context);
	}


	context.done();
};
