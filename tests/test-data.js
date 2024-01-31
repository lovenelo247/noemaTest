const { faker } = require("@faker-js/faker");

export const firstUser = {
  username: faker.internet.userName(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  password: faker.internet.password(),
  address: faker.address.streetAddress(true),
  city: faker.address.city(),
  state: faker.address.state(),
  zipCode: faker.address.zipCode(),
  phoneNumber: faker.phone.number("080########"),
};

export const payBill = {
  payeeName: `${faker.name.firstName()} ${faker.name.lastName()}`,
  payeeAddress: faker.address.streetAddress(true),
  payeeCity: faker.address.city(),
  payeeState: faker.address.state(),
  payeeZipCode: faker.address.zipCode(),
  payeePhoneNumber: faker.phone.number("080########"),
  payeeAccountNumber: faker.finance.account(),
  amount: 3499800,
};

export const invalidUser = {
  username: faker.internet.userName(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  password: faker.internet.password(),
  address: faker.address.streetAddress(true),
  phoneNumber: faker.phone.number("080########"),
};
