import { test, expect } from "@fixtures/api_fixture";
import { API_CONFIG } from "@environment/environment.config";

test.describe('Sample API - Profile Management', () => {
  let token: string;

  test.beforeEach(async ({ authClient }) => {
    const response = await authClient.login(API_CONFIG.credentials);
    expect(response.status()).toBe(200);

    const body = await response.json();
    token = body.token;
  });

  test('Verify token acquired', async () => {
    expect(token).toBeDefined();
  });

  test('Get user profile', async ({ authClient }) => {
    const response = await authClient.getProfile(token);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.profile.username).toBe(API_CONFIG.credentials.identifier);
  });
});