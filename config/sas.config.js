const {
	sasAccessKey,
	storageAccount,
	storageDefaultContainerName,
	AZURE_STORAGE_CONNECTION_STRING,
	AzureWebJobsStorage
} = process.env;

const connectionString = AZURE_STORAGE_CONNECTION_STRING || AzureWebJobsStorage;

module.exports = {
	storageAccount,
	storageAccessKey: sasAccessKey,
	defaultContainerName: storageDefaultContainerName || '', // add a default container name
	defaultPermissionLevel: 'r',
	defaultTokenDuration: 60,
	connectionString
};
