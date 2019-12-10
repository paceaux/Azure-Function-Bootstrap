const appInsights = require('../Common/insights');

appInsights.initialize();

const client = appInsights.getClient();

const { AzureLog, AzureLogError } = require('../Common/utils');

module.exports = async function azureFunctionMain(context, httpRequest) {
	let returnStatus = 202;
	let returnMessage;

	try {
		if (!httpRequest.body) {
			throw Error('No JSON body provided');
		}
		returnMessage = Object.assign({}, httpRequest.body);

		client.trackEvent({
			name: 'WebHookDebugger:',
			properties: {
				returnMessage
			}
		});

		AzureLog(JSON.stringify(returnMessage), context);
	} catch (error) {
		returnStatus = httpRequest.body ? 500 : 400;
		returnMessage = error;

		AzureLogError(error, context);
		client.trackException({
			exception: error
		});
	}

	// it's an accepted practice to set response on the context obj for azure functions
	// eslint-disable-next-line no-param-reassign
	context.res = {
		headers: {
			'Content-Type': 'application/javascript'
		},
		status: returnStatus,
		body: { returnMessage }
	};
};
