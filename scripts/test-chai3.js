const chai = require('chai');
const expect = chai.expect;

try {
  expect(undefined).to.be.at.least(1);
} catch (e) {
  console.log('Test 5:', e.message);
}
