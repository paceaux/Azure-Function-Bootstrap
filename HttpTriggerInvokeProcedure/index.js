const appInsights = require('../Common/insights');

appInsights.initialize();

const client = appInsights.getClient();
const { asyncRunStoredProcedure } = require('../Common/sqlService');
const { generateSasToken } = require('../Common/sasToken');

/* IF WEBHOOK
const { postHttp } = require('../Common/httpService');
*/
const { storedProcedureConfigurations } = require('../config');

/**
 * @typedef BlobParameters
 * @property {string} blobName full path to the blob
 * @property {string} containerName name of the container
 */

/**
 * @typedef StoredProcHttpBody
 * @property {string} storedProcedureName Name of the stored procedure
 * @property {BlobParameters} blobParameters. If stored proc is running on a blob
 * @property {string} callbackUrl optional. If used in a webhook, this is the url to post to
 */

/**
 * @param  {Context} context provided by an azure function
 * @param  {StoredProcHttpBody} request
 */
module.exports = async function azureFunctionMain(context, request) {
	let returnStatus = 202;
	let result;
	let response;
	const { storedProcedureName, blobParameters, callbackUrl } = request.body;
	const { blobName, containerName } = blobParameters;
	/**
	 * If stored proc runs on blob, then get a path and name separately
	 */
	const filePath = blobName.split('/')[0];
	const fileName = blobName.split('/')[1];
	/* IF WEBHOOK
	let webhookResponse = { containerName, blobName };
	*/

	try {
		if (!request) throw Error('No data to run');
		const storedProcedureConfig = storedProcedureConfigurations[storedProcedureName];
		const sasToken = await generateSasToken(containerName, blobName);
		// if stored procedure runs against a blob...
		const blobParamsForProcedure = {
			sasToken,
			fileName,
			filePath
		};
		result = await asyncRunStoredProcedure(blobParamsForProcedure, storedProcedureConfig);
		response = Object.assign({}, result);

		/* IF WEBHOOK
		webhookResponse = Object.assign({}, response); // don't assume that what goes in the webhook is what goes in response
		*/
	} catch (error) {
		returnStatus = 500;
		response = error;
		client.trackException({ exception: error });
	}

	/* IF WEBHOOK
	try {
		if (callbackUrl && webhookResponse) {
			postHttp(callbackUrl, webhookResponse);
		}
	} catch (error) {
		client.trackException({ exception: error });
		context.done(error);
	}
	*/

	// eslint-disable-next-line no-param-reassign
	context.res = {
		headers: {
			'Content-Type': 'application/javascript'
		},
		status: returnStatus,
		body: { response }
	};
};
