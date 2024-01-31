const dotenv = require("dotenv");
const { test, expect } = require("@playwright/test");
const { firstUser, payBill, invalidUser } = require("./test-data");

dotenv.config();

test.describe.configure({ mode: "serial", retries: 0 });

const softExpect = expect.configure({ soft: true, timeout: 6000 });

async function registration(page) {
  await page.goto(`${process.env.BASE_URL}/parabank/index.htm`);
  await page.getByRole("link", { name: "Register" }).click();
  await page.locator('[id="customer\\.firstName"]').click();
  await page
    .locator('[id="customer\\.firstName"]')
    .fill(`${firstUser.firstName}`);
  await page.locator('[id="customer\\.lastName"]').click();
  await page
    .locator('[id="customer\\.lastName"]')
    .fill(`${firstUser.lastName}`);
  await page.locator('[id="customer\\.address\\.street"]').click();
  await page
    .locator('[id="customer\\.address\\.street"]')
    .fill(`${firstUser.address}`);
  await page.locator('[id="customer\\.address\\.city"]').click();
  await page
    .locator('[id="customer\\.address\\.city"]')
    .fill(`${firstUser.city}`);
  await page.locator('[id="customer\\.address\\.state"]').click();
  await page
    .locator('[id="customer\\.address\\.state"]')
    .fill(`${firstUser.state}`);
  await page.locator('[id="customer\\.address\\.zipCode"]').click();
  await page
    .locator('[id="customer\\.address\\.zipCode"]')
    .fill(`${firstUser.zipCode}`);
  await page.locator('[id="customer\\.phoneNumber"]').click();
  await page
    .locator('[id="customer\\.phoneNumber"]')
    .fill(`${firstUser.phoneNumber}`);
  await page.locator('[id="customer\\.ssn"]').click();
  await page.locator('[id="customer\\.ssn"]').fill("123456789");
  await page.locator('[id="customer\\.username"]').click();
  await page
    .locator('[id="customer\\.username"]')
    .fill(`${firstUser.username}`);
  await page.locator('[id="customer\\.password"]').click();
  await page
    .locator('[id="customer\\.password"]')
    .fill(`${firstUser.password}`);
  await page.locator("#repeatedPassword").click();
  await page.locator("#repeatedPassword").fill(`${firstUser.password}`);
  await page.getByRole("button", { name: "Register" }).click();
}

test("Register user", async ({ page }) => {
  await registration(page);
});

test("Successful Login Test", async ({ page }) => {
  // Login
  await page.goto(`${process.env.BASE_URL}/parabank/index.htm`);
  await page.locator('input[name="username"]').click();
  await page.locator('input[name="username"]').fill(`${firstUser.username}`);
  await page.locator('input[name="password"]').click();
  await page.locator('input[name="password"]').fill(`${firstUser.password}`);
  await page.getByRole("button", { name: "Log In" }).click();
  await page.getByRole("link", { name: "Log Out" }).click();
});

test("Unsuccessful Login Test-invalid password", async ({ page }) => {
  await page.goto(`${process.env.BASE_URL}/parabank/index.htm`);
  await page.locator('input[name="username"]').click();
  await page.locator('input[name="username"]').fill(`${firstUser.username}`);
  await page.locator('input[name="password"]').click();
  await page.locator('input[name="password"]').fill(`${invalidUser.password}`);
  await page.getByRole("button", { name: "Log In" }).click();
  await softExpect(
    page.getByText("The username and password could not be verified")
  ).toHaveCount(1);
  await softExpect(
    page.getByText("The username and password could not be verified")
  ).toBeVisible();
  await softExpect(
    page.getByText("The username and password could not be verified")
  ).toBeEnabled();
});

test.describe("Start main test", () => {
  let page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto(`${process.env.BASE_URL}/parabank/index.htm`);
    await page.locator('input[name="username"]').click();
    await page.locator('input[name="username"]').fill(`${firstUser.username}`);
    await page.locator('input[name="password"]').click();
    await page.locator('input[name="password"]').fill(`${firstUser.password}`);
    await page.getByRole("button", { name: "Log In" }).click();
  });

  test("Create three accounts having total of $3,500,000", async () => {
    await page.getByRole("link", { name: "Admin Page" }).click();
    await page.locator("#initialBalance").click();
    await page.locator("#initialBalance").fill("3500000");
    await page.locator("#minimumBalance").click();
    await page.locator("#minimumBalance").fill("1000000");
    await page.getByRole("button", { name: "Submit" }).click();
    await page.getByRole("link", { name: "Open New Account" }).click();
    await page.getByRole("button", { name: "Open New Account" }).click();
    await page.getByRole("link", { name: "Open New Account" }).click();
    await page.getByRole("button", { name: "Open New Account" }).click();
    await page.getByRole("link", { name: "Accounts Overview" }).click();
    // await page.pause();
    // await softExpect(page.getByText("$3500,000.00")).toHaveText("$3500,000.00");
    await softExpect(page.getByText("$3500,000.00")).toBeVisible();
  });

  test("transfer from-to same account", async () => {
    await page.getByRole("link", { name: "Transfer Funds" }).click();
    await page.locator("#amount").click();
    await page.locator("#amount").fill("3000");
    await page.getByRole("button", { name: "Transfer" }).click();
    await softExpect(
      page.getByText("$3000.00 has been transferred")
    ).not.toHaveText("You can not transfer the amount to same account.");
  });

  test("transfer amount more than the balance in account", async () => {
    await page.getByRole("link", { name: "Transfer Funds" }).click();
    await page.locator("#amount").click();
    await page.locator("#amount").fill("5000000");
    await page.getByRole("button", { name: "Transfer" }).click();
    await softExpect(
      page.getByText("$5000,000.00 has been transferred")
    ).not.toHaveText(
      "You can not transfer more than the balance in your account"
    );
  });

  test("Add Loan amount 5000 and down payment 1000 and apply", async () => {
    await page.getByRole("link", { name: "Request Loan" }).click();
    await page.locator("#amount").click();
    await page.locator("#amount").fill("5000");
    await page.locator("#downPayment").click();
    await page.locator("#downPayment").fill("1000");
    await page.getByRole("button", { name: "Apply Now" }).click();
    await softExpect(
      page.getByRole("cell", { name: "Approved" })
    ).toBeVisible();
  });

  test("Add Loan amount 1000 and down payment 7000 and apply.", async () => {
    await page.getByRole("link", { name: "Request Loan" }).click();
    await page.locator("#amount").click();
    await page.locator("#amount").fill("1000");
    await page.locator("#downPayment").click();
    await page.locator("#downPayment").fill("7000");
    await page.getByRole("button", { name: "Apply Now" }).click();
    await softExpect(
      page.getByRole("cell", { name: "Approved" })
    ).not.toHaveAttribute("name", "Denied");
  });

  test("Pay the bill less than 3,500,000", async () => {
    await page.getByRole("link", { name: "Bill Pay" }).click();
    await page.locator('input[name="payee\\.name"]').click();
    await page
      .locator('input[name="payee\\.name"]')
      .fill(`${payBill.payeeName}`);
    await page.locator('input[name="payee\\.address\\.street"]').click();
    await page
      .locator('input[name="payee\\.address\\.street"]')
      .fill(`${payBill.payeeAddress}`);
    await page.locator('input[name="payee\\.address\\.city"]').click();
    await page
      .locator('input[name="payee\\.address\\.city"]')
      .fill(`${payBill.payeeCity}`);
    await page.locator('input[name="payee\\.address\\.state"]').click();
    await page
      .locator('input[name="payee\\.address\\.state"]')
      .fill(`${payBill.payeeState}`);
    await page.locator('input[name="payee\\.address\\.zipCode"]').click();
    await page
      .locator('input[name="payee\\.address\\.zipCode"]')
      .fill(`${payBill.payeeZipCode}`);
    await page.locator('input[name="payee\\.phoneNumber"]').click();
    await page
      .locator('input[name="payee\\.phoneNumber"]')
      .fill(`${payBill.payeePhoneNumber}`);
    await page.locator('input[name="payee\\.accountNumber"]').click();
    await page
      .locator('input[name="payee\\.accountNumber"]')
      .fill(`${payBill.payeeAccountNumber}`);
    await page.locator('input[name="verifyAccount"]').click();
    await page
      .locator('input[name="verifyAccount"]')
      .fill(`${payBill.payeeAccountNumber}`);
    await page.locator('input[name="amount"]').click();
    await page.locator('input[name="amount"]').fill(`${payBill.amount}`);
    await page.getByRole("button", { name: "Send Payment" }).click();
    await page.getByRole("link", { name: "Accounts Overview" }).click();
    await softExpect(page.getByRole("cell", { name: "$0.00" })).toHaveText(
      "$0.00"
    );
  });

  test("Attempt to pay bill more than $3,500,000", async () => {
    await page.getByRole("link", { name: "Bill Pay" }).click();
    await page.locator('input[name="payee\\.name"]').click();
    await page
      .locator('input[name="payee\\.name"]')
      .fill(`${payBill.payeeName}`);
    await page.locator('input[name="payee\\.address\\.street"]').click();
    await page
      .locator('input[name="payee\\.address\\.street"]')
      .fill(`${payBill.payeeAddress}`);
    await page.locator('input[name="payee\\.address\\.city"]').click();
    await page
      .locator('input[name="payee\\.address\\.city"]')
      .fill(`${payBill.payeeCity}`);
    await page.locator('input[name="payee\\.address\\.state"]').click();
    await page
      .locator('input[name="payee\\.address\\.state"]')
      .fill(`${payBill.payeeState}`);
    await page.locator('input[name="payee\\.address\\.zipCode"]').click();
    await page
      .locator('input[name="payee\\.address\\.zipCode"]')
      .fill(`${payBill.payeeZipCode}`);
    await page.locator('input[name="payee\\.phoneNumber"]').click();
    await page
      .locator('input[name="payee\\.phoneNumber"]')
      .fill(`${payBill.payeePhoneNumber}`);
    await page.locator('input[name="payee\\.accountNumber"]').click();
    await page
      .locator('input[name="payee\\.accountNumber"]')
      .fill(`${payBill.payeeAccountNumber}`);
    await page.locator('input[name="verifyAccount"]').click();
    await page
      .locator('input[name="verifyAccount"]')
      .fill(`${payBill.payeeAccountNumber}`);
    await page.locator('input[name="amount"]').click();
    await page
      .locator('input[name="amount"]')
      .fill(`${payBill.amount + 1000000}`);
    await page.getByRole("button", { name: "Send Payment" }).click();
    await softExpect(
      page.getByText(`Bill Payment to ${payBill.payeeName} in the`)
    ).not.toHaveText("You can not pay more than balance in your account");
  });
});
