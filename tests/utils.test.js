/* eslint-disable no-unused-expressions */
/* eslint-disable no-proto */
/* eslint-disable no-undef */

/* Disabling a few linter options:
no-undef => because the expect and describe variables are present only at test runtime
no-proto => because this is a faster way to confirm prototype
no-unused-expressions => because that's the standard practice for chai
*/
const { expect } = require('chai');
const {
	returnDateTime,
	mergeArrays
} = require('../Common/utils');
describe('utils testing', () => {
	describe('returnDateTime', () => {
		it('returns a string', () => {
			const dateTime = returnDateTime();
			expect(dateTime).to.be.a('string');
		});
		it('returns a date time that\'s accurate', ()=>{
			const nowDate = new Date();
			const nowMonth = `${nowDate.getMonth() + 1}`;
			const nowYear = nowDate.getFullYear().toString();
			const dateTime = returnDateTime();
			const [year, month] = dateTime.split(new RegExp('[-:T]'));

			expect(parseInt(year, 10)).to.equal(parseInt(nowYear, 10));
			expect(parseInt(month, 10)).to.equal(parseInt(nowMonth, 10));
		});
	});
	describe('mergeArrays', () => {
		const mockArray1 = ['foo', 'bar'];
		const mockArray2 = ['baz'];

		it('merges arrays', () => {
			const merged = mergeArrays(mockArray1, mockArray2);
			expect(merged.length).to.equal(mockArray1.length + mockArray2.length);
		});
	});
});
