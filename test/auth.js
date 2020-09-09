const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const { signup } = require('../dist/controllers/auth');

describe('Auth controller signup', function () {

  it('Should throw an error if validation detect thath e-mail already exists', () => {
    const req = {
      'express-validator#contexts': [
        {
          message: 'Validation failed.'
        }
      ],
    };

    expect(signup.bind(this, req, {}, () => { })).to.throw('Validation failed.');
  });

  it('Should do not throw an error with the correct data on the body request.', () => {
    const req = {
      body: { email: "usertest@test.com", name: "UserTest", password: "UserTestPass123!" }
    };

    sinon.stub(mongoose.Model.prototype, 'save');
    mongoose.Model.prototype.save.restore();

    expect(signup.bind(this, req, {}, () => { })).not.to.throw();
  });
});
