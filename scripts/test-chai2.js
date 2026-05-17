const chai = require('chai');
const expect = chai.expect;

try {
  expect(undefined).to.equal('Software Engineering');
} catch (e) {
  console.log('Test 4:', e.message);
}
