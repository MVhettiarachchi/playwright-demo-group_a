import { test, expect } from "../src/fixtures/api_fixture.js";
import { API_CONFIG } from "../src/config/config.js";
import { ApiHelper } from "../src/helper/api_helper.js";
import { createUserData } from "../src/data/user_data.js";

test.describe('Admin Management - User Creation', () => {
  let token: string;

  // Authenticate before each test to ensure complete isolation
  test.beforeEach(async ({ apiClient }) => {
    const response = await apiClient.login(API_CONFIG.credentials);
    const responseBody = await ApiHelper.validateAndParse(response, 200);
    
    token = responseBody.token;
  });

  test('create new user using JSON data file', async ({ apiClient }) => {
    // 1. Generate dynamic payload using Emma's base template
    const newUserPayload = createUserData("emma");

    // 2. Action handled by Client using isolated token
    const response = await apiClient.createUser(token, newUserPayload);
    
    // 3. Utility handled by Helper (expecting 201 Created)
    const responseBody = await ApiHelper.validateAndParse(response, 201);    

    // 4. Assertions
    expect(responseBody).toBeDefined();
    console.log("User created successfully using external JSON payload.");
  });
});