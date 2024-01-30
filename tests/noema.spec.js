const{test, expect}=require('@playwright/test')


test('Successful Login Test', async ({page}) => {
    await page.goto('http://localhost:8080/parabank/index.htm')
    await page.locator('input[name="username"]').click()
    await page.locator('input[name="username"]').fill('lovenelo_242')
    await page.locator('input[name="password"]').click()
    await page.locator('input[name="password"]'). fill('Teetee008!008!')
    await page.getByRole('button', { name: 'Log In' }).click()
    await expect( page.getByText('Welcome Nigeria Edhughoro')).toHaveCount(1)
    await expect(page.getByText('Welcome Nigeria Edhughoro')).toBeVisible()
    await expect(page.getByText('Welcome Nigeria Edhughoro')).toBeEnabled()

   
});
test('Unsuccessful Login Test-invalid password', async ({page}) => {
    await page.goto('http://localhost:8080/parabank/index.htm')
    await page.locator('input[name="username"]').click()
    await page.locator('input[name="username"]').fill('lovenelo_242')
    await page.locator('input[name="password"]').click()
    // await page.pause()
    await page.locator('input[name="password"]'). fill('Feefee008!008!')
    await page.getByRole('button', { name: 'Log In' }).click()
    await expect( page.getByText('The username and password could not be verified')).toHaveCount(1)
    await expect(page.getByText('The username and password could not be verified')).toBeVisible()
    await expect(page.getByText('The username and password could not be verified')).toBeEnabled()

})
// Here, we register an account dynamically and create 3 accounts with a total amounts of $3,500,000. Once an account is created
// the balance is 3,500,000- when another one is created it transfers from the first one the minimum amount to the second one and also with the third
test('Create three accounts having total of $3,500,000', async ({page})=> {
    await page.goto('http://localhost:8080/parabank/index.htm')
    await page.locator('input[name="username"]').click()
    await page.locator('input[name="username"]').fill('12345')
    await page.pause()
    await page.locator('input[name="password"]').click()
    await page.locator('input[name="password"]'). fill('12345')
    await page.getByRole('button', { name: 'Log In' }).click()

    await page.getByRole('link', { name: 'Accounts Overview' }).click();
    await expect(page.getByText('$3500,000.00')).toHaveText('$3500,000.00');
    await page.getByRole('link', { name: 'Log Out' }).click();
});
//The account created above should be debited and the same account credit. I think what we should do here is to create
// a dynamic account again and debit it and credit it again. This task should throw an error which we should look out for
test('transfer from-to same account', async({page})=>{
  await page.goto('http://localhost:8080/parabank/index.htm');
  await page.locator('input[name="username"]').click();
  await page.locator('input[name="username"]').fill('12345');
  await page.locator('input[name="password"]').click();
  await page.locator('input[name="password"]').fill('12345');
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.getByRole('link', { name: 'Transfer Funds' }).click();
  await page.locator('#amount').click();
  await page.locator('#amount').fill('1000');
  await page.getByRole('button', { name: 'Transfer' }).click();
  await expect( page.getByText('You can not transfer the amount to same account')).toBeVisible();
  await page.getByRole('link', { name: 'Log Out' }).click();
});
// Lets register a user again dynamically, then try to transfer an amount that larger than the total of $3,500,000. 
//This should threw an error and that is what we are looking for
test('transfer amount more than the balance in account', async({page})=>{
  await page.goto('http://localhost:8080/parabank/index.htm');
  await page.locator('input[name="username"]').click();
  await page.locator('input[name="username"]').fill('12345');
  await page.locator('input[name="password"]').click();
  await page.locator('input[name="password"]').fill('12345');
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.getByRole('link', { name: 'Transfer Funds' }).click()
  await page.locator('#amount').click();
  await page.locator('#amount').fill('5000000');
  await page.pause()
  await page.getByRole('button', { name: 'Transfer' }).click();
  await expect( page.getByText('“You can not transfer more than the balance in your account')).toBeVisible();
  await page.getByRole('link', { name: 'Log Out' }).click();
})
// Create a user dynamically, go to loan request and request a loan of $5000 with a down payment
//of $1000. This should pass- looking for the keyword approved
test('Add Loan amount 5000 and down payment 1000 and apply', async({page})=>{
    await page.goto('http://localhost:8080/parabank/index.htm');
    await page.locator('input[name="username"]').click();
    await page.locator('input[name="username"]').fill('12345');
    await page.locator('input[name="password"]').click();
    await page.locator('input[name="password"]').fill('12345');
    await page.getByRole('button', { name: 'Log In' }).click();
    await page.getByRole('link', { name: 'Request Loan' }).click();
    await page.locator('#amount').click();
    await page.locator('#amount').fill('5000');
    await page.locator('#downPayment').click();
    await page.locator('#downPayment').fill('1000');
    await page.pause()
    await page.getByRole('button', { name: 'Apply Now' }).click();
    await expect(page.getByRole('cell', { name: 'Approved' })).toBeEnabled();
})
// create a user dynamically and then request a loan of $1000 with a down payment of $7000. This should throw
// up an error. We are looking for the keyword denied here
test('Add Loan amount 1000 and down payment 7000 and apply.', async({page})=> {
    await page.goto('http://localhost:8080/parabank/index.htm');
    await page.locator('input[name="username"]').click();
    await page.locator('input[name="username"]').fill('12345');
    await page.locator('input[name="password"]').click();
    await page.locator('input[name="password"]').fill('12345');
    await page.getByRole('button', { name: 'Log In' }).click();
    await page.getByRole('link', { name: 'Request Loan' }).click();
    await page.locator('#amount').click();
    await page.locator('#amount').fill('1000');
    await page.locator('#downPayment').click();
    await page.locator('#downPayment').fill('7000');
    await page.getByRole('button', { name: 'Apply Now' }).click();
    await expect(page.getByRole('cell', { name: 'Denied' })).toBeEnabled();
})
//Create a user dynamically and attempt to pay bill less than $3,500,000. This should be successful
test('Pay the bill less than 3,500,000', async({page})=>{
    await page.goto('http://localhost:8080/parabank/index.htm');
  await page.locator('input[name="username"]').click();
  await page.locator('input[name="username"]').fill('12345');
  await page.locator('input[name="password"]').click();
  await page.locator('input[name="password"]').fill('12345');
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.getByRole('link', { name: 'Bill Pay' }).click();
  await page.locator('input[name="payee\\.name"]').click();
  await page.locator('input[name="payee\\.name"]').fill('Nelo');
  await page.locator('input[name="payee\\.address\\.street"]').click();
  await page.locator('input[name="payee\\.address\\.street"]').fill('3 Idowu Street');
  await page.locator('input[name="payee\\.address\\.city"]').click();
  await page.locator('input[name="payee\\.address\\.city"]').fill('Lagos');
  await page.locator('input[name="payee\\.address\\.state"]').click();
  await page.locator('input[name="payee\\.address\\.state"]').fill('Lagos');
  await page.locator('input[name="payee\\.address\\.zipCode"]').click();
  await page.locator('input[name="payee\\.address\\.zipCode"]').fill('234');
  await page.locator('input[name="payee\\.phoneNumber"]').click();
  await page.locator('input[name="payee\\.phoneNumber"]').fill('08011112222');
  await page.locator('input[name="payee\\.accountNumber"]').click();
  await page.locator('input[name="payee\\.accountNumber"]').fill('13566');
  await page.locator('input[name="verifyAccount"]').click();
  await page.locator('input[name="verifyAccount"]').fill('13566');
  await page.locator('input[name="amount"]').click();
  await page.locator('input[name="amount"]').fill('3499800');
  await page.pause()
  await page.getByRole('combobox').selectOption('13566');
  await page.getByRole('button', { name: 'Send Payment' }).click();
  await expect(page.getByText('Bill Payment to Nelo in the the amount of $3499800.00 from account 13566 was successful.')).toBeEnabled()
  await page.getByRole('link', { name: 'Accounts Overview' }).click();
  await expect(page.getByRole('cell', { name: '$0.00' })).nth(1).toHaveText('$0.00');
});

//Attempt to pay bill more than $3,500,000 . The system should throw an error
test('test', async ({ page }) => {
  await page.goto('http://localhost:8080/parabank/index.htm');
  await page.locator('input[name="username"]').click();
  await page.locator('input[name="username"]').fill('67890');
  await page.locator('input[name="password"]').click();
  await page.locator('input[name="password"]').fill('67890');
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.getByRole('link', { name: 'Bill Pay' }).click();
  await page.locator('input[name="payee\\.name"]').click();
  await page.locator('input[name="payee\\.name"]').fill('Nelo');
  await page.locator('input[name="payee\\.address\\.street"]').click();
  await page.locator('input[name="payee\\.address\\.street"]').fill('3 Idowu Lane');
  await page.locator('input[name="payee\\.address\\.city"]').click();
  await page.locator('input[name="payee\\.address\\.city"]').fill('Lagos');
  await page.locator('input[name="payee\\.address\\.state"]').click();
  await page.locator('input[name="payee\\.address\\.state"]').fill('Lagos');
  await page.locator('input[name="payee\\.address\\.zipCode"]').click();
  await page.locator('input[name="payee\\.address\\.zipCode"]').fill('234');
  await page.locator('input[name="payee\\.phoneNumber"]').click();
  await page.locator('input[name="payee\\.phoneNumber"]').fill('08033334444');
  await page.locator('input[name="payee\\.accountNumber"]').click();
  await page.locator('input[name="payee\\.accountNumber"]').click();
  await page.locator('input[name="payee\\.accountNumber"]').fill('13899');
  await page.locator('input[name="verifyAccount"]').click();
  await page.locator('input[name="verifyAccount"]').fill('13899');
  await page.locator('input[name="amount"]').click();
  await page.locator('input[name="amount"]').fill('5000000');
  await page.getByRole('combobox').selectOption('13899');
  await page.getByRole('button', { name: 'Send Payment' }).click();
  await page.getByText('“You cannot pay more than balance in your account”').toBeEnabled();
});

        
    

 
