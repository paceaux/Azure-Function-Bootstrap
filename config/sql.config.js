const {
	sqlSettingPassword,
	sqlSettingUserName,
	sqlSettingServer,
	sqlSettingDatabase
} = process.env;

module.exports = {
	authentication: {
		options: {
			userName: sqlSettingUserName,
			password: sqlSettingPassword
		},
		type: 'default'
	},
	server: sqlSettingServer,
	options: {
		database: sqlSettingDatabase,
		encrypt: true
	}
};
