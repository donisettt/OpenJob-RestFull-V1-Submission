const chai = require('chai');
const expect = chai.expect;

const responseJson = { data: { userId: '123' } };

try {
  expect(responseJson.data.id).to.be.a('string');
} catch (e) {
  console.log('Test 1 (data.id):', e.message);
}

try {
  expect(responseJson.data.addedUser.id).to.be.a('string');
} catch (e) {
  console.log('Test 2 (data.addedUser.id):', e.name, e.message);
}

try {
  expect(responseJson.data).to.have.property('addedUser');
} catch (e) {
  console.log('Test 3 (have.property addedUser):', e.message);
}

