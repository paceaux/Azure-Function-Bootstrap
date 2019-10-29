const instrumentationKey = process.env.APPINSIGHTS_INSTRUMENTATIONKEY;

module.exports = {
	instrumentationKey: instrumentationKey || '', // ADD A DEFAULT INSTRUMENTATION KEY IN CASE ONE ISN'T IN LOCAL ENVIRONMENT
	samplingPercentage: 33
};
