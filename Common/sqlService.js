const mssql = require('mssql');
const appInsights = require('./insights');

appInsights.initialize();

const client = appInsights.getClient();
const { sql: configSql } = require('../config');

const { authentication, server, options } = configSql;
const { userName, password } = authentication.options;
const { database, encrypt } = options;

const msSqlConfig = {
	user: userName,
	password,
	server,
	database,
	options: { encrypt }
};

/** gets working connection to database
 * @param  {Object} connectionParams
 * @returns {Promise<connection>}
 */
async function getDatabaseConnection(connectionParams) {
	const connection = new mssql.ConnectionPool(connectionParams);
	await connection.connect();

	return connection;
}
/** gets a request to run a stored procedure
 * @param  {Pool} pool
 * @returns {Promise<request>} request
 */
async function getRequest(pool) {
	const request = await pool.request();

	return request;
}

/**
 * @typedef StoredProcedureFileParams
 * @param {string} sasToken token to send into stored proc to access
 * @param {string} fileName fileName on which to execute the stored procedure
 * @param {string} filePath fileName on which to execute the stored procedure
 * @param {string} platformParam fileName on which to execute the stored procedure
 * @param {string} rawTableParam fileName on which to execute the stored procedure
 */

/**
 * Creates a stored procedure with parameters
 * @param {StoredProcedureFileParams} storedProcedureFileParams
 * @param {mssql.request} request a request generated with getRequest()
 * @returns {mssql.request} an mssql procedure with parameters added to it
 */

async function getStoredProcedure(storedProcedureFileParams, request) {
	const {
		sasToken,
		fileName,
		filePath,
		platformParam,
		rawTableParam
	} = storedProcedureFileParams;
	const procedure = request
		.input('SASKey', mssql.VarChar, sasToken)
		.input('filename', mssql.VarChar, fileName)
		.input('filepath', mssql.VarChar, filePath)
		.input('rawtable', mssql.VarChar, rawTableParam)
		.input('debug', mssql.Int, 0)
		.input('subjectarea', mssql.VarChar, platformParam)
		.input('fileformat', mssql.VarChar, 'JSON');

	return procedure;
}

/**
 * @typedef FileParameters
 * @property {string} fileName
 * @property {string} filePath
 */
/**
 * @typedef PlatformParameters
 * @property {string} storedProcedureName
 * @property {string} platformParam
 * @property {string} rawTableParam
 * @property {string} dataSourceParam
 */

/** Executes a stored procedure
 * @param  {FileParameters} blobParamsForProcedure
 * @param  {PlatformParameters} storedProcedureConfig
 * @returns {Promise<>} result of stored procedure
 */
async function asyncRunStoredProcedure(blobParamsForProcedure, storedProcedureConfig) {
	const { storedProcedureName } = storedProcedureConfig;
	const storedProcedureParameters = Object.assign({}, blobParamsForProcedure, storedProcedureConfig);
	let result;

	try {
		const connection = await getDatabaseConnection(msSqlConfig);
		const request = await getRequest(connection);
		const storedProcedure = await getStoredProcedure(storedProcedureParameters, request);

		result = await storedProcedure.execute(storedProcedureName);
	} catch (error) {
		result = error;
		client.trackException({ exception: error });
	}

	return result;
}

module.exports = {
	getDatabaseConnection,
	getRequest,
	getStoredProcedure,
	asyncRunStoredProcedure
};
