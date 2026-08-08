import { test, expect } from "@fixtures/api_fixture";
import { AppState } from "@environment/state";
import { ApiHelper } from "@helper/api_helper";
import { API_CONFIG } from "@environment/environment.config";

test.describe('Sample API - Authentication', () => {
  test('login with valid credentials', async ({ authClient }) => {
    // AuthClient contains the login method
    const response = await authClient.login(API_CONFIG.credentials);
    
    const responseBody = await ApiHelper.validateAndParse(response, 200);
    AppState.token = responseBody.token;
    console.log("Token captured via structured client workflow.");
  });
});

test.describe('Sample API - Active User Management', () => {
  test('activate user with valid user', async ({ userClient }) => {
    expect(AppState.token).toBeDefined();

    const userId = "USR-ADM-6257";

    // UserClient contains the activeUser method
    const response = await userClient.activeUser(
      userId,
      AppState.token
    );

    const responseBody = await ApiHelper.validateAndParse(response, 200);
    console.log("User activated successfully:", responseBody);
  });
});