const azure = require('azure-storage');
const sasConfig = require('../config').sas;

const {
	storageAccount,
	storageAccessKey,
	defaultContainerName,
	defaultPermissionLevel,
	defaultTokenDuration
} = sasConfig;
/**
 * @param  {string} containerName Name of the default storage container
 * @param  {string} blobName='' name of the blob
 * @param  {string} permissionLevel='r' l, c, d, l, r, w
 * @returns {string} sasToken that was generated
 */
async function generateSasToken(containerName = defaultContainerName, blobName = '', permissionLevel = defaultPermissionLevel) {
	const blobService = azure.createBlobService(storageAccount, storageAccessKey);

	// Set start time to five minutes ago to avoid clock skew.
	const startDate = new Date();
	startDate.setMinutes(startDate.getMinutes() - 5);
	const expiryDate = new Date(startDate);
	expiryDate.setMinutes(startDate.getMinutes() + defaultTokenDuration);


	const sharedAccessPolicy = {
		AccessPolicy: {
			Permissions: permissionLevel,
			Start: startDate,
			Expiry: expiryDate
		}
	};
	const sasToken = blobService.generateSharedAccessSignature(
		containerName,
		blobName,
		sharedAccessPolicy
	);
	return sasToken;
}

module.exports = {
	generateSasToken
};
