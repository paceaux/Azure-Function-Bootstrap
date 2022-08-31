const stream = require('stream');
const azure = require('azure-storage');
const appInsights = require('./insights');

appInsights.initialize();

const { Readable } = stream;
const client = appInsights.getClient();

const { QueueMessageEncoder } = azure;
const { sas } = require('../config');

const {
	storageAccount,
	storageAccessKey,
	defaultContainerName,
	connectionString
} = sas;

/** creates a QueueService with connection string, or storage account and access key from config
 * @param {string} storageString Optional. default is AZURE_STORAGE_CONNECTION_STRING
 * @returns QueueService from azure storage
 */
function getQueueService(storageString = connectionString) {
	const serviceParams = storageString
		? [storageString]
		: [storageAccount, storageAccessKey];
	const queueService = azure.createQueueService(...serviceParams);

	queueService.messageEncoder = new QueueMessageEncoder.TextBase64QueueMessageEncoder();
	return queueService;
}

/**
 * creates a BlobService with a connection string, or relies on storage acct and key from config
 * @param {*} storageString Optional. default is AZURE_STORAGE_CONNECTION_STRING
 * @returns BlobService from azure storage
 */

function getBlobService(storageString = connectionString) {
	const serviceParams = storageString
		? [storageString]
		: [storageAccount, storageAccessKey];
	const blobService = azure.createBlobService(...serviceParams);

	return blobService;
}

/** Asynchronously creates a queue
 * @param  {QueueService} queueService object created from getQueueService
 * @param  {String} queueName name of the queue to be created
 * @returns {Promise<messageQueue} a messaging queue that was either created or already existed
 */
async function createQueue(queueService, queueName) {
	return new Promise((resolve, reject) => {
		if (!queueService) reject(new Error('need a queueService generated from getQueueService'));
		queueService.createQueueIfNotExists(queueName, (error, responseQueue, createResponse) => {
			if (error) {
				reject(error);
			}
			if (responseQueue || createResponse) {
				resolve(responseQueue);
			}
		});
	});
}

/**
 * @typedef QueueMetadata
 * @property {Number} approximateMessagesCount number of messages
 * @property {Object} metadata information about queue
 */

/**
 * Asynchronously Gets data for a queue
 * @param {String} queueName
 * @returns {Promise<QueueMetadata>} A promise to queue metadata
 */
async function getQueueData(queueName) {
	const queueService = getQueueService();

	return new Promise((resolve, reject) => {
		queueService.getQueueMetadata(queueName, (error, results) => {
			if (error) {
				reject(error);
			}

			if (results) {
				resolve(results);
			}
		});
	});
}

/**
 * @typedef MessageParams
 * @property {string} messageQueueName
 * @property {string} messageQueueText
 */

/** Asynchronously sends a message to a queue
 * @param {QueueService} queueService
 * @param  {MessageParams} messageParams
 * @returns {Promise<messageMetadata>} metadata about the message that was sent
 */
function sendMessageToQueue(queueService, messageParams) {
	const { messageQueueName, messageQueueText } = messageParams;

	return new Promise((resolve, reject) => {
		if (!queueService) reject(new Error('need a queueService generated from getQueueService'));
		queueService.createMessage(messageQueueName, messageQueueText, (error, results, response) => {
			if (error) {
				client.trackException({ exception: error });
				reject(error);
			}

			if (response) {
				resolve(results, response);
				client.trackEvent({ name: 'queueMessageSent', properties: results });
			}
		});
	});
}

/**
 * @param  {string} containerName
 * @param  {BlobService} overrideBlobService
 */
async function createContainer(containerName, overrideBlobService) {
	const blobService = overrideBlobService || getBlobService();
	const containerOptions = {
		publicAccessLevel: 'blob'
	};
	return new Promise((resolve, reject) => {
		blobService
			.createContainerIfNotExists(
				containerName,
				containerOptions,
				(error, result, response) => {
					if (error) {
						client.trackException({ exception: error });
						reject(error);
					}
					if (response) {
						client.trackEvent({ name: 'createContainer', properties: response });
						resolve({ ...response, ...result });
					}
				}
			);
	});
}
/**
 * @typedef BlobData
 * @property {Object} data object with extracted data
 */

/**
 * @typedef BlobParams
 * @property {string} filePath Directory/
 * @property {string} fileFullPath directory and filename
 * @property {string} platform Name of the platform
 * @property {string} fileDataType file extension to use, type of data
 * @property {string} blobContainerName Optional. container name
 */

/** Asynchronously saves data into a blob
 * @param  {BlobParams} blobParams parameters for saving the blob
 * @param  {BlobData} blobData extracted data
 * @param  {object} [metadata={}] optional. additional data to add to blob
 * @param {BlobService} [blobService=getBlobService()] optional. a blob service
 */
async function saveToBlob(blobParams, blobData, metadata = {}, blobService = getBlobService()) {
	const startTime = Date.now();
	const { fileFullPath, blobContainerName } = blobParams;
	const dataToSave = JSON.stringify({ data: blobData });
	const options = {
		contentSettings: {
			contentType: 'application/json'
		},
		metadata
	};

	const containerName = blobContainerName || defaultContainerName;
	await createContainer(containerName, blobService);

	return new Promise((resolve, reject) => {
		// 1) Initialize a stream reader for the Json content
		const jsonStream = new Readable();
		jsonStream.push(dataToSave);
		jsonStream.push(null);

		// 2) Initialize a stream writer to stream to the Blob target destination file
		// we don't want to use createBlockBlobFromText; it has a cap of 64mb
		const blobWriteStream = blobService.createWriteStreamToBlockBlob(
			containerName,
			fileFullPath,
			options,
			(error) => {
				if (error) {
					client.trackException({ exception: error });
					reject(error);
				} else {
					const timeToSave = Date.now() - startTime;
					client.trackEvent({ name: 'save to Blob', properties: { blobParams } });
					client.trackMetric({ name: 'time for saveToBlob to run', value: timeToSave });
					resolve(blobParams);
				}
			}
		);

		// 3) Write all Json content to the Blob destination stream
		jsonStream.pipe(blobWriteStream);
	});
}

module.exports = {
	saveToBlob,
	sendMessageToQueue,
	getQueueService,
	createQueue,
	getQueueData,
	getBlobService,
	createContainer
};
