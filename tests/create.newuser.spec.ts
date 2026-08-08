import { test, expect } from "@fixtures/api_fixture";
import { API_CONFIG } from "@environment/environment.config";
import { ApiHelper } from "@helper/api_helper";
import { createUserData } from "@data/user_data";

test.describe('Admin Management - User Creation', () => {
  let token: string;

  test.beforeEach(async ({ authClient }) => {
    const response = await authClient.login(API_CONFIG.credentials);
    const responseBody = await ApiHelper.validateAndParse(response, 200);
    
    token = responseBody.token;
  });

  test('create new user using JSON data file', async ({ userClient }) => {
    const newUserPayload = createUserData("emma");
    const response = await userClient.createUser(token, newUserPayload);
    const responseBody = await ApiHelper.validateAndParse(response, 201);    

    expect(responseBody).toBeDefined();
    console.log("User created successfully using external JSON payload.");
  });
});