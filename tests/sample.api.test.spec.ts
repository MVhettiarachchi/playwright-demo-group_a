import { test, expect } from "../src/fixtures/api_fixture.js";
import { API_CONFIG } from "../src/config/config.js";
import { AppState } from "../src/environment/state.js";
import { ApiHelper } from "../src/helper/api_helper.js";

test.describe('Sample API - Authentication', () => {
  test('login with valid credentials', async ({ apiClient }) => {
    // Action handled by Client
    const response = await apiClient.login(API_CONFIG.credentials);
    
    // Utility handled by Helper
    const responseBody = await ApiHelper.validateAndParse(response, 200);
    
    AppState.token = responseBody.token;
    console.log("Token captured via structured client workflow.");
  });
});

test.describe('Sample API - Profile Management', () => {
  test('profile management', async ({ apiClient }) => {
    expect(AppState.token).toBeDefined();

    // Action handled by Client
    const response = await apiClient.getProfile(AppState.token);
    
    // Utility handled by Helper
    const responseBody = await ApiHelper.validateAndParse(response, 200);
    
    expect(responseBody.profile.username).toEqual(API_CONFIG.credentials.identifier);
  });
});
// import { test, expect, type APIRequestContext } from "@playwright/test";

// let requestContext: APIRequestContext;
// let token: string;

// test.beforeEach(async ({ playwright }) => {
//   requestContext = await playwright.request.newContext({
//     baseURL: 'http://75.119.154.239/api/'
//   });
// });

// test.describe('Sample API', () => {
//   test('login with valid credentials', async () => {
//     const requestBody = {
//       "identifier": "groupa",
//       "password": "123456",
//       "portal": "admin"
//     };

//     const response = await requestContext.post('auth/login', { 
//       data: requestBody
//     });

//     expect(response.status()).toBe(200);
//     const responseBody = await response.json();
//     token = responseBody.token;
//     console.log("Token successfully captured:", token);
//   });
// });

// test.describe('Sample API - profile management', () => {
//   test('profile management', async () => {
//     expect(token).toBeDefined();

//     const response = await requestContext.get('admin/profile', { 
//       headers: {
//         'Authorization': `Bearer ${token}`
//       }
//     });

//     expect(response.status()).toBe(200);
//     const responseBody = await response.json();
//     expect(responseBody.profile.username).toEqual('groupa');
//   });
// });