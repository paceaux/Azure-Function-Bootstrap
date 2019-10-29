const appInsights = require('../Common/insights');

appInsights.initialize();

const client = appInsights.getClient();
const { postHttp } = require('../Common/httpService');
const { getConfig } = require('../Common/configManager');
const { AzureLogError } = require('../Common/utils');

module.exports = async function azureFunctionMain(context, queueItem) {
	const startTime = Date.now();
	const { platformSettings, processPlatform } = queueItem;

	/* If there's a webhook
	let webhookResponse;
	*/

	const { invocationId } = context.executionContext;
	client.trackEvent({
		name: 'queueTriggeredLongRunningJob:beforeProcessingQueueMessage',
		properties: { queueItem, invocationId }
	});

	try {
		// DO THINGS

		/* IF WEBHOOK
		webhookResponse = {

		};
		*/
		client.trackEvent({
			name: 'queueTriggeredLongRunningJob:afterProcessingQueueMessage',
			properties: { queueItem, invocationId }
		});
	} catch (error) {
		AzureLogError(error, context, client);
		context.done(error);
	}

	/* IF WEBHOOK
	try {
		const { callbackUrl } = queueItem;

		if (webhookResponse && callbackUrl) {
			const webhookStatus = await postHttp(callbackUrl, webhookResponse);
			client.trackEvent({
				name: 'queueTriggeredLongRunningJob:afterSendWebhook',
				properties: { webhookStatus, invocationId }
			});
		}
	} catch (error) {
		AzureLogError(error, context, client);
		context.done(error);
	}
	*/
};
