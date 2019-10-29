/** Delays execution of a function by resolving a promise within a timer
 * @param  {number} t time in milliseconds
 * @param  {function} val function to return
 */
function delay(t, val) {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(val);
		}, t);
	});
}

/** Returns 4-digit year, 2 digit month, day, hour, min and second
 * @returns {string} "year:month:day:hour:minute:second"
 */
function returnDateTime() {
	const date = new Date();
	return date
		.toJSON()
		.slice(0, 19)
		.replace(/[-T]/g, ':');
}

/** merges arrays
 * @param  {} ...arrays
 * @returns {array}
 */
function mergeArrays(...arrays) {
	let jointArray = [];

	arrays.forEach((array) => {
		jointArray = [...jointArray, ...array];
	});

	return jointArray;
}

/** Evaluates an array, makes the key lowercasee and makes the value an object with original keyname
 * @param  {Array} iterable=[] an array of arrays:[[key,val],[key,val]]
 * @returns Array
 */
function LowercaseIterable(iterable = []) {
	if (iterable.length === 0) return [];

	const newIterable = iterable.map(([key, val]) => {
		const entry = [
			key.toLowerCase(),
			{ originalKeyName: key, value: val }
		];
		return entry;
	});

	return newIterable;
}

/**
 * @extends Map
 * @classdesc Makes it possible to do a case insensitive search of a map by key
 * @namespace SearchableKeyMap
 * @property {Map} originalMap the original, unchanged map
 */
class SearchableKeyMap extends Map {
	/**
	 * @param {Iterable} iterable an array of arrays: [[key,val], [key,val]]
	 */
	constructor(iterable) {
		super(LowercaseIterable(iterable));
		this.originalMap = new Map(iterable);
	}

	/** Determines if any of SearchableKeyMap's keys contain a substring
	 * @param  {string} searchKey
	 *
	 * @returns {Boolean}
	 */
	containsKey(searchKey) {
		const searchKeyName = searchKey.toLowerCase();
		const entries = this.entries();
		let result = false;
		let nextEntry = entries.next();

		while (!nextEntry.done) {
			const key = nextEntry.value[0];

			if (key.includes(searchKeyName)) {
				result = true;
				break;
			}

			nextEntry = entries.next();
		}

		return result;
	}

	/** Searches in a map for a single key containing a substring
	 * @param  {string} searchKey
	 *
	 * @returns string. First result it finds
	 */
	getKeyContaining(searchKey) {
		const searchKeyName = searchKey.toLowerCase();
		const entries = this.entries();
		let result;
		let nextEntry = entries.next();

		while (!nextEntry.done) {
			const [key] = nextEntry.value;

			if (key.includes(searchKeyName)) {
				result = key;
				break;
			}

			nextEntry = entries.next();
		}

		return result;
	}

	/** Searches for keys in a map that contain a substring	 *
	 * @param  {string} searchKey
	 *
	 * @returns array
	 */
	getKeysContaining(searchKey) {
		const result = [];
		const searchKeyName = searchKey.toLowerCase();
		const entries = this.entries();
		let nextEntry = entries.next();

		while (!nextEntry.done) {
			const [key] = nextEntry.value;

			if (key.includes(searchKeyName)) {
				result.push(key);
			}

			nextEntry = entries.next();
		}

		return result;
	}

	/** Creates a SearchableKeyMap of keys based on a search string
	 * @param  {string} keyName key to search for
	 *
	 * @returns SearchableKeyMap
	 */
	mapFromKeysContaining(keyName) {
		if (!keyName) throw new Error('Keyname not provided');

		const newMap = new SearchableKeyMap();
		const searchKeyName = keyName.toLowerCase();
		const keys = this.getKeysContaining(searchKeyName);

		keys.forEach((key) => {
			const { originalKeyName, value } = this.get(key);
			newMap.set(originalKeyName, value);
		});

		return newMap;
	}
}

/** converts milliseconds to minutes
 * @param  {number} milliseconds
 * @returns number
 */
function millisecondsToMinutes(milliseconds) {
	return (milliseconds / 1000) / 60;
}

/** converts minutes to milliseconds
 * @param  {number} minutes
 */
function minutesToMilliseconds(minutes) {
	return minutes * (60 * 1000);
}

/** outputs a log in a developer-friendly format
 * @param  {string} message
 * @param  {context} context
 */
// eslint-disable-next-line no-unused-vars
function AzureLog(message, context) {
	// TODO: figure out why context doesn't work async
	// eslint-disable-next-line no-console
	console.log(`
	===============:invocationId:${context.executionContext.invocationId}


	${message}


	===============
	`);
}

/** outputs an error log format
 * @param  {string|object|array|number} errorToLog whatever should be displayed in the error
 * @param  {context} context context provided by outer function
 * @param {client } client appinsights client
 */
// eslint-disable-next-line no-unused-vars
function AzureLogError(errorToLog, context, client) {
	// console is a failsafe for when context doesn't work. Which ... can happen.
	// eslint-disable-next-line no-console
	if (!context) console.log('THERE IS NO CONTEXT', errorToLog);

	const { invocationId } = context && context.executionContext;
	context.log.error(errorToLog);
	if (client) client.trackException({ exception: errorToLog, properties: { invocationId } });
}

async function asyncForEach(array, callback) {
	for (let index = 0; index < array.length; index += 1) {
		// the entire friggin' point of this function is this problem
		// eslint-disable-next-line no-await-in-loop
		await callback(array[index], index, array);
	}
}

module.exports = {
	delay,
	returnDateTime,
	mergeArrays,
	SearchableKeyMap,
	AzureLog,
	AzureLogError,
	minutesToMilliseconds,
	millisecondsToMinutes,
	asyncForEach
};
