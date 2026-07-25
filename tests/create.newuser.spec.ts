import { test, expect } from "../src/fixtures/api_fixture.js";
import { API_CONFIG } from "../src/config/config.js";
import { AppState } from "../src/environment/state.js";
import { ApiHelper } from "../src/helper/api_helper.js";
import { createUserData } from "../src/data/user_data.js";

test.describe('Admin Management - Authentication Setup', () => {
  test('login with valid credentials', async ({ apiClient }) => {
    // Action handled by Client
    const response = await apiClient.login(API_CONFIG.credentials);
    
    // Utility handled by Helper
    const responseBody = await ApiHelper.validateAndParse(response, 200);
    
    AppState.token = responseBody.token;
    console.log("Token captured via structured client workflow.");
  });
});

test.describe('Admin Management - User Creation', () => {
  test('create new user using JSON data file', async ({ apiClient }) => {
    expect(AppState.token).toBeDefined();

    // Fetches Emma's data from src/data/users.json dynamically
    const newUserPayload = createUserData("emma");

    // Action handled by Client
    const response = await apiClient.createUser(AppState.token, newUserPayload);
    
    // Utility handled by Helper
const responseBody = await ApiHelper.validateAndParse(response, 201);    
    // Assertion
    expect(responseBody).toBeDefined();
    console.log("User created successfully using external JSON payload.");
  });
});