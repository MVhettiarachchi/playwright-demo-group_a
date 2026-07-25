import { test, expect } from "../src/fixtures/api_fixture.js";
import { AppState } from "../src/environment/state.js";
import { ApiHelper } from "../src/helper/api_helper.js";
import { API_CONFIG } from "../src/config/config.js";


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

test.describe('Sample API - Active User Management', () => {

  test('activate user with valid user', async ({ apiClient }) => {

    expect(AppState.token).toBeDefined();

    const userId = "USR-ADM-6257"; // query param value

    const response = await apiClient.activeUser(
      userId,
      AppState.token
    );

    const responseBody = await ApiHelper.validateAndParse(response, 200);

    console.log("User activated successfully:", responseBody);

  });

});