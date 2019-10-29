// THESE CAN CHANGE BASED ON THE STORED PROCEDURE
const cfg1StoredProcedureName = process.env['sqlProcedureParameterStoredProcedureName-configName1'];
const cfg1PlatformParam = process.env['sqlProcedureParameterPlatformParam-configName1'];
const cfg1RawTableParam = process.env['sqlProcedureParameterRawTableParam-configName1'];
const cfg1DataSourceParam = process.env['sqlProcedureParameterDataSourceParam-configName1'];


const cfg1StoredProcedureParameters = {
	storedProcedureName: cfg1StoredProcedureName || 'FileJSONExtractFromBLOB',
	platformParam: cfg1PlatformParam || '',
	rawTableParam: cfg1RawTableParam || '',
	dataSourceParam: cfg1DataSourceParam || ''
};

const storedProcedureConfigurations = {
	debug: '0',
	storedProc1: cfg1StoredProcedureParameters
};

module.exports = storedProcedureConfigurations;
