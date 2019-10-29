const appInsights = require('../Common/insights');

appInsights.initialize();

const client = appInsights.getClient();
// eslint-disable-next-line import/order
const fetch = require('node-fetch');

/**
 * @typedef FetchOptions
 * @property {string} hostname
 * @property {string} port
 * @property {string} method
 * @property {object} headers
 */

/** converts a uri into options that the node-fetch library needs for posting data
 * @param  {string} uri
 * @param  {string} method. optional. default=POST
 * @returns {FetchOptions}
 */
function getOptions(uri, method = 'POST') {
	// this is a known global in node
	// eslint-disable-next-line no-undef
	const url = new URL(uri);
	const { hostname, port } = url;
	const options = {
		hostname,
		port,
		method,
		headers: {
			'Content-Type': 'application/json'
		}
	};

	return options;
}

/** Asynchronously sends an object to a URI
 * @param  {string} uri
 * @param  {object} data any JavaScript object, this will be stringified
 * @returns {Promise<HttpResponse>}
 */
async function postHttp(uri, data) {
	const options = getOptions(uri);
	const body = JSON.stringify(data);
	let result;

	try {
		const response = await fetch(uri, { ...options, body });
		result = response.json();
	} catch (error) {
		result = error;
		client.trackException({ exception: error });
	}
	return result;
}


async function getHttp(uri) {
	const options = getOptions(uri, 'GET');

	try {
		const response = await fetch(uri, { ...options });
		return response;
	} catch (error) {
		client.trackException({ exception: error });
		throw error;
	}
}

module.exports = {
	getHttp,
	postHttp
};
