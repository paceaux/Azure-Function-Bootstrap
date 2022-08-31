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
const { SearchableKeyMap } = require('../Common/utils');

const NAME_OF_CONFIG = '-configName1';
const NAME_OF_CONFIG_LOWER = NAME_OF_CONFIG.toLowerCase();

describe('Testing the Custom Map', () => {
	const envMap = new SearchableKeyMap(Object.entries(envConfig));

	describe('checking the map itself', () => {
		it('Creates a searchable map', () => {
			expect(envMap.__proto__.constructor.name).to.equal('SearchableKeyMap');
		});
		it('a has a copied map', () => {
			expect(envMap).to.have.property('originalMap');
			expect(envMap.originalMap.__proto__.constructor.name).to.equal('Map');
		});
		it('has  lowercased keys', () => {
			expect(envMap.has(`outputblobstoragepath${NAME_OF_CONFIG_LOWER}`)).to.be.true;
			expect(envMap.has(`OutputBlobStoragePath${NAME_OF_CONFIG}`)).to.be.false;
		});
	});

	describe('containsKey', () => {
		it(`finds a key with ${NAME_OF_CONFIG} with containsKey`, () => {
			expect(envMap.containsKey(NAME_OF_CONFIG)).to.be.true;
		});

		it(`finds a key with ${NAME_OF_CONFIG_LOWER} `, () => {
			expect(envMap.containsKey(NAME_OF_CONFIG_LOWER)).to.be.true;
		});

		it('doesn\'t find a key with -foo with containsKey', () => {
			expect(envMap.containsKey('-foo')).to.be.false;
		});
	});

	describe('getKeyContaining', () => {
		it('gets a key containing a partial value with getKeyContaining', () => {
			const singleKey = envMap.getKeyContaining(NAME_OF_CONFIG);
			expect(singleKey).to.equal(`outputblobstoragepath${NAME_OF_CONFIG_LOWER}`);
		});

		it('returns undefined if there isn\'t a key containg -foo', () => {
			expect(envMap.getKeyContaining('-foo')).to.equal(undefined);
		});
	});

	describe('getKeysContaining', () => {
		it(`gets KEYS containing ${NAME_OF_CONFIG}`, () => {
			const fbKeys = envMap.getKeysContaining(NAME_OF_CONFIG);
			expect(fbKeys).to.have.lengthOf(6);
		});

		it('doesn\'t get KEYS containing -foo', () => {
			const fbKeys = envMap.getKeysContaining('-foo');
			expect(fbKeys).to.have.lengthOf(0);
		});
	});

	describe('mapFromKeysContaining', () => {
		it(`Produces a map from keys containing ${NAME_OF_CONFIG}`, () => {
			const fbMap = envMap.mapFromKeysContaining(NAME_OF_CONFIG);
			expect(fbMap.size).to.equal(6);
		});
		it(`has a map from keys w/ ${NAME_OF_CONFIG}  in original casing`, () => {
			const fbMap = envMap.mapFromKeysContaining(NAME_OF_CONFIG);
			expect(fbMap.has(`TemporaryBlobStoragePath${NAME_OF_CONFIG}`)).to.be.true;
		});
		it('Produces a map from keys containing sql', () => {
			const fbMap = envMap.mapFromKeysContaining('sqlSetting');
			expect(fbMap.size).to.equal(4);
		});
		it('throws an error if empty string', () => {
			expect(() => envMap.mapFromKeysContaining(''))
				.to
				.throw('Keyname not provided');
		});
	});
});
