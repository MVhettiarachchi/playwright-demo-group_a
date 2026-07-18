import { test, expect } from "@playwright/test";
//Pass the token
let token : string
test.describe('Sample API', () => {
  test('login with valid credentials', async ({ request }) => {
    const requestBody = {
      "identifier": "groupa",
      "password": "123456",
      "portal": "admin"
    };

    // Make the API call using the requestBody payload
    const response = await request.post('http://75.119.154.239/api/auth/login', { 
      data: requestBody
    });

    // Assert and parse the response
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    
    // Save the token to the global variable
    token = responseBody.token;

    // Check response data/token in the console
    console.log(responseBody.token);
  });
});



test.describe('Sample API -profile management', () => {
  test('profile management', async ({ request }) => {


    // Make the API call using the requestBody payload
    const response = await request.get('http://75.119.154.239/api/admin/profile', { 
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    // Assert and parse the response
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    
    console.log("User Details:", responseBody);

    expect(responseBody.profile.username).toEqual('groupa');
  });
});