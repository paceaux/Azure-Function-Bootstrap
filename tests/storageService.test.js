/* eslint-disable no-unused-expressions */
/* eslint-disable no-proto */
/* eslint-disable no-undef */

/* Disabling a few linter options:
no-undef => because the expect and describe variables are present only at test runtime
no-proto => because this is a faster way to confirm prototype
no-unused-expressions => because that's the standard practice for chai
*/
const { expect } = require('chai');
const envConfig = require('../local.settings.json').Values;

const sasConfig = require('../config/sas.config');

// DON'T EXECUTE TESTS IF STORAGE HASN'T BEEN SETUP
if (!sasConfig.connectionString || !sasConfig.storageAccount) return;
const {
	saveToBlob,
	getBlobService,
	createContainer
} = require('../Common/storageService');

describe('The Storage Environment', () => {
	describe('local.settings.json info', () => {
		it('has connection strings', () => {
			expect(envConfig).to.have.any.keys('AZURE_STORAGE_CONNECTION_STRING', 'AzureWebJobsStorage');
		});
	});

	describe('sas.config', () => {
		it('has a defaultContainerName', () => {
			expect(sasConfig.defaultContainerName).to.not.be.undefined;
		});
		it('has a defaultPermissionLevel', () => {
			expect(sasConfig.defaultPermissionLevel).to.not.be.undefined;
		});
	});
});

describe('storageServiceTesting', () => {
	describe('blobService', () => {
		it('getBlobService', async () => {
			const blobService = await getBlobService(envConfig.AzureWebJobsStorage);
			expect(blobService).to.have.property('storageAccount');
		});
	});

	describe('createContainer', () => {
		it('creates a container', async () => {
			const blobService = await getBlobService(envConfig.AzureWebJobsStorage);
			const containerResult = await createContainer('unit-tests', blobService);

			expect(containerResult.isSuccessful).to.be.true;
		});
		it('creates a container that already exists', async () => {
			const blobService = await getBlobService(envConfig.AzureWebJobsStorage);
			const containerResult = await createContainer('unit-tests', blobService);

			expect(containerResult.created).to.be.false;
		});
	});

	describe('saveToBlob', async () => {
		const blobService = await getBlobService(envConfig.AzureWebJobsStorage);
		const fileName = `UT-${Date.now()}`;
		const fileFolder = new Date().toJSON();
		const unitTestParams = {
			fileFullPath: `${fileFolder}/${fileName}`,
			blobContainerName: 'unit-tests'
		};

		it('saves some text in an existing container', async () => {
			const blobData = await saveToBlob(unitTestParams, '{test: "is is some test text"}', {}, blobService);
			expect(blobData).to.have.property('fileFullPath');
		});

		it('saves some text in a container that doesn\'t exist', async () => {
			const newUtParams = {
				fileFullPath: `${fileFolder}/${fileName}`,
				blobContainerName: `ut-${Date.now()}`
			};
			const blobData = await saveToBlob(newUtParams, '{test: "is is some test text"}', {}, blobService);
			expect(blobData).to.have.property('fileFullPath');
		});
	});
});
