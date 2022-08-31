const instrumentationKey = process.env.APPINSIGHTS_INSTRUMENTATIONKEY;
const localSettings = require('../local.settings.json').Values;

/*
  when an azure function is running, local.settings.json.values is added to process.env
  However, if you run an azure function locally, and THEN run the unit tests,
    the unit tests will fail because the appinsights client wasn't instantiated with a valid key
    For some reason, this gets unit tests to pass
*/
module.exports = {
	instrumentationKey: instrumentationKey || localSettings.APPINSIGHTS_INSTRUMENTATIONKEY || '', // ADD A DEFAULT INSTRUMENTATION KEY IN CASE ONE ISN'T IN LOCAL ENVIRONMENT
	samplingPercentage: 33
};
