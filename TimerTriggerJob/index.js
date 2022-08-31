const appInsights = require('../Common/insights');

appInsights.initialize();

const client = appInsights.getClient();
const { AzureLog, AzureLogError } = require('../Common/utils');
const { postHttp } = require('../Common/httpService');

module.exports = async function azureFunctionMain(context, timerSchedule) {
	const startTime = new Date().toISOString();

	const { invocationId } = context.executionContext;
	client.trackEvent({
		name: 'timerTriggeredJob:beforeProcessingTimer',
		properties: { timerSchedule, startTime, invocationId }
	});
	AzureLog(`timerTriggeredJob:beforeProcessingTimer ${startTime}`, context);

	try {
		// DO THINGS
		// for example, post to a webhook
		await postHttp('http://localhost:7071/api/HttpWebhookDebugger', timerSchedule);
	} catch (timerProcessingError) {
		timerProcessingError.invocationId = invocationId;

		AzureLogError(timerProcessingError, context);

		client.trackException({
			exception: timerProcessingError
		});
	}

	const endTime = new Date().toISOString();

	AzureLog(`timerTriggeredJob:afterProcessingTimer ${endTime}`, context);

	client.trackEvent({
		name: 'timerTriggeredJob:afterProcessingTimer',
		properties: {
			timerSchedule,
			startTime,
			endTime,
			invocationId
		}
	});
	context.done();
};
