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
const { getConfig } = require('../Common/configManager');

const CONFIG_NAME = 'configName1';
describe('testing configManager', () => {
	describe('The platform configurations', () => {
		it('has platform ', () => {
			expect(envConfig).to.have.any.keys(
				`OutputBlobStoragePath-${CONFIG_NAME}`,
				`TemporaryBlobStoragePath-${CONFIG_NAME}`,
				`AutomatedLoadTransformConfig-${CONFIG_NAME}`,
				`sqlProcedureParameterStoredProcedureName-${CONFIG_NAME}`
			);
		});
	});

	describe('getConfig', () => {
		const platformConfig = getConfig(CONFIG_NAME, envConfig);

		it('gets a  platform config with just  params', () => {
			expect(platformConfig.size).to.equal(6);
		});
		it('has a config without the config namespace name in it ', () => {
			expect(platformConfig.has(`OutputBlobStoragePath${CONFIG_NAME}`)).to.be.false;
			expect(platformConfig.has(`TemporaryBlobStoragePath${CONFIG_NAME}`)).to.be.false;
			expect(platformConfig.has(`sqlProcedureParameterStoredProcedureName${CONFIG_NAME}`)).to.be.false;
			expect(platformConfig.has(`sqlProcedureParameterPlatformParam${CONFIG_NAME}`)).to.be.false;
		});
		it('has a platform Config with the same casing ', () => {
			expect(platformConfig.has('OutputBlobStoragePath')).to.be.true;
			expect(platformConfig.has('TemporaryBlobStoragePath')).to.be.true;
			expect(platformConfig.has('sqlProcedureParameterStoredProcedureName')).to.be.true;
			expect(platformConfig.has('sqlProcedureParameterPlatformParam')).to.be.true;
		});
	});
});
