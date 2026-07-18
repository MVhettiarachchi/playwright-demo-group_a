import { test, expect, type APIRequestContext } from "@playwright/test";

let requestContext: APIRequestContext;
let token: string;

// SQA Practice: Destructure 'playwright' to safely instantiate a new context inline
test.beforeEach(async ({ playwright }) => {
  requestContext = await playwright.request.newContext({
    baseURL: 'http://75.119.154.239/api/'
  });
});

test.describe('Sample API', () => {
  test('login with valid credentials', async () => {
    const requestBody = {
      "identifier": "groupa",
      "password": "123456",
      "portal": "admin"
    };

    const response = await requestContext.post('auth/login', { 
      data: requestBody
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    token = responseBody.token;
    console.log("Token successfully captured:", token);
  });
});

test.describe('Sample API - profile management', () => {
  test('profile management', async () => {
    expect(token).toBeDefined();

    const response = await requestContext.get('admin/profile', { 
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.profile.username).toEqual('groupa');
  });
});