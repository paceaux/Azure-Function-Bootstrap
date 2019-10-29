const appInsights = require('../Common/insights');

appInsights.initialize();

const client = appInsights.getClient();

/* SEND MESSAGE TO QUEUE
const { sendMessageToQueue, getQueueService, createQueue } = require('../Common/storageService');
const { queues } = require('../config');

const queueService = getQueueService();

*/

module.exports = async function azureFunctionMain(context, req) {
	/* SEND MESSAGE TO QUEUE
	const messageQueueText = JSON.stringify({ ...req.body }); //  get the body message
	const messageQueueName = queues.triggerQueue; // get a queue name
	let returnMessage = 'queue message submitted successfully'; // a default message to send to a queue
	*/
	let returnStatus = 202;
	let returnMessage;

	const { invocationId } = context.executionContext;
	client.trackEvent({
		name: 'httpTriggerLongRunningJob:beforeSendMessage',
		properties: { request: req, invocationId }
	});

	try {
		if (!req.body) {
			throw Error('No JSON body provided');
		}

		// DO SOMETHING HERE

		/* SEND MESSAGE TO QUEUE
		await createQueue(queueService, messageQueueName); // create a queue if it doesn't exist
		returnMessage = await sendMessageToQueue(queueService, { messageQueueName, messageQueueText }); // send a message to the queue
		client.trackEvent({
			name: 'httpTriggerLongRunningJob:afterSendMessage',
			properties: { messageQueueName, returnMessage, invocationId }
		});
		*/
	} catch (error) {
		returnStatus = req.body ? 500 : 400;
		returnMessage = error;
		client.trackException({ exception: error });
	}

	// it's an accepted practice to set response on the context obj for azure functions
	// eslint-disable-next-line no-param-reassign
	context.res = {
		headers: {
			'Content-Type': 'application/javascript'
		},
		status: returnStatus,
		body: { ...returnMessage }
	};
};
