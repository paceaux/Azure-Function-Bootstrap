const { SearchableKeyMap } = require('../Common/utils');

/** Creates a Map that contains configuration properties from the environment
 * @param  {string} configName name of namespaced configurations in app settings
 * @param  {Object} environment=process.env an object with environment settings.
 *
 * @returns SearchableKeyMap
 * @example const sqlSettings = getConfig('sql', process.env)
 */
function getConfig(configName, environment = process.env) {
	const normalizedConfig = new Map();
	try {
		const environmentMap = new SearchableKeyMap(Object.entries(environment));
		// gets all config values related specifically to the configName
		const config = environmentMap.mapFromKeysContaining(configName);

		// normalization on assumption that specific configs are -ConfigName
		config.forEach((value, key) => {
			const normalizedKeyName = key
				.replace('-', '')
				.replace(new RegExp(configName, 'gi'), '');

			normalizedConfig.set(normalizedKeyName, value);
		});
	} catch (error) {
		// eslint-disable-next-line no-console
		console.log(error);
	}
	return normalizedConfig;
}

module.exports = {
	getConfig
};
