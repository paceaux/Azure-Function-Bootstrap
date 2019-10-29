const sas = require('./sas.config');
const insights = require('./insights.config');
const queues = require('./queues.config');
const sql = require('./sql.config');
const storedProcedure = require('./storedProcedure.config');

const {
	debugBlobFilePrefix,
	debugShowLogs
} = process.env;

module.exports = {
	sas,
	insights,
	queues,
	sql,
	storedProcedure,
	showDebuggingInfo: (debugShowLogs === 'true') || false,
	debugBlobFilePrefix: debugBlobFilePrefix || ''
};
