import { test, expect } from "../src/fixtures/api_fixture.js";
import { API_CONFIG } from "../src/config/config.js";
import { ApiHelper } from "../src/helper/api_helper.js";

test.describe.configure({ mode: 'serial' });

test.describe('User Deactivation API Tests', () => {
  let token: string;
  let targetUserId = 'USR-ADM-0123';
  let targetUsername = 'emma';
  let allUsers: any[] = [];

  // Authenticate once before running the serial suite
  test.beforeAll(async ({ apiClient }) => {
    const loginRes = await apiClient.login(API_CONFIG.credentials);
    const loginBody = await ApiHelper.validateAndParse(loginRes, 200);
    token = loginBody.token;
    console.log("Token successfully captured for serial test execution.");
  });

  // TC-01: GET all users
  test('TC-01: Should GET all users successfully after login', async ({ apiClient }) => {
    const response = await apiClient.getUsers(token);  
    const body = await ApiHelper.validateAndParse(response, 200);
    allUsers = body.users ?? body.data ?? body;
    
    expect(Array.isArray(allUsers)).toBeTruthy();
    console.log(`Total users found in system: ${allUsers.length}`);

    // Verify target user 'emma' exists
    const testingUser = allUsers.find(
      (u: any) => u.user_id === 'USR-ADM-0123' || u.username === 'emma'
    );

    if (testingUser) {
      targetUserId = testingUser.user_id ?? testingUser.id;
      targetUsername = testingUser.username ?? testingUser.displayName;
      console.log(`Found target user: ${targetUsername} (ID: ${targetUserId})`);
    } else {
      console.log("Warning: User 'emma' not found in GET users list. Falling back to default ID.");
    }
  });

  // TC-02: Confirm target user's current status
  test('TC-02: Should confirm target user current status', async () => {
    const user = allUsers.find((u: any) => (u.user_id ?? u.id) === targetUserId);
    if (user) {
      console.log(`User: ${targetUsername} (${targetUserId})`);
      console.log(`Current Status: ${user.status}`);
      expect(typeof user.status).toBe('string');
    } else {
      console.log("Skipping detailed check as target user was not found in the list.");
    }
  });

  // TC-03: DEACTIVATE the user
  test('TC-03: Should DEACTIVATE the user', async ({ apiClient }) => {
    console.log(`Deactivating user: ${targetUsername} (ID: ${targetUserId})`);

    const response = await apiClient.updateUserStatus(token, targetUserId, 'inactive');
    const body = await ApiHelper.validateAndParse(response, 200);

    expect(body.message).toContain('User deactivated');
    console.log("Deactivation response: " + JSON.stringify(body));
  });

  // TC-03b: Deactivate the user again when they are already inactive
  test('TC-03b: Should check behavior when deactivating an already deactivated user', async ({ apiClient }) => {
    console.log(`Attempting second deactivation for user: ${targetUsername} (ID: ${targetUserId})`);

    const response = await apiClient.updateUserStatus(token, targetUserId, 'inactive');
    console.log(`Second deactivation response status: ${response.status()}`);
    
    try {
      const body = await response.json();
      console.log("Second deactivation response body: " + JSON.stringify(body));
    } catch (e) {
      console.log("Second deactivation response was not valid JSON");
    }
  });

  // TC-04: VERIFY user is now INACTIVE
  test('TC-04: Should VERIFY user is now INACTIVE', async ({ apiClient }) => {
    const response = await apiClient.getUsers(token);
    const body = await ApiHelper.validateAndParse(response, 200);
    const users = body.users ?? body.data ?? body;

    const user = users.find((u: any) => (u.user_id ?? u.id) === targetUserId);
    expect(user).toBeDefined();
    expect(user.status).toBe('inactive');
    console.log(`CONFIRMED: ${targetUsername} is now INACTIVE`);
  });

  // TC-05: RE-ACTIVATE the user (cleanup)
  test('TC-05: Should RE-ACTIVATE the user (cleanup)', async ({ apiClient }) => {
    console.log(`Re-activating user: ${targetUsername} (ID: ${targetUserId})`);

    const response = await apiClient.updateUserStatus(token, targetUserId, 'active');
    const body = await ApiHelper.validateAndParse(response, 200);

    expect(body.message).toContain('User activated');
    console.log("Re-activation response: " + JSON.stringify(body));
  });

  // TC-06: VERIFY user is back to ACTIVE
  test('TC-06: Should VERIFY user is back to ACTIVE', async ({ apiClient }) => {
    const response = await apiClient.getUsers(token);
    const body = await ApiHelper.validateAndParse(response, 200);
    const users = body.users ?? body.data ?? body;

    const user = users.find((u: any) => (u.user_id ?? u.id) === targetUserId);
    expect(user).toBeDefined();
    expect(user.status).toBe('active');
    console.log(`COMPLETE: ${targetUsername} -> ACTIVE -> INACTIVE -> ACTIVE`);
  });
});