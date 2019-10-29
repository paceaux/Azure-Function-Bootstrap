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
const { getHttp, postHttp } = require('../Common/httpService');

const POST_MOCK = { foo: 'bar' };

describe('HTTP testing', () => {
    it('tests getHttp', async () => {
        const getTest = await getHttp('https://jsonplaceholder.typicode.com/posts/1');
        expect(getTest.status).to.equal(200);

    });
    it('posts Http', async () => {
        const getPost = await postHttp('https://jsonplaceholder.typicode.com/posts', POST_MOCK);
        console.log(getPost);
        expect(getPost).to.have.property('foo');

    })
});