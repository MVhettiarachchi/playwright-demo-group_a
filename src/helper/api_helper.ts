import { expect, type APIResponse } from "@playwright/test";

export class ApiHelper {
  // Common utility to validate responses and parse JSON safely
  static async validateAndParse(response: APIResponse, expectedStatus: number = 200) {
    expect(response.status()).toBe(expectedStatus);
    return await response.json();
  }

  // Validate that the top-level properties exist and are arrays (may be empty)
  static validateEndpointStructure(body: any) {
    expect(body).toBeTruthy();
    expect(body).toHaveProperty('users');
    expect(body).toHaveProperty('stats');
    expect(body).toHaveProperty('userLevels');

    // Ensure arrays exist even if empty
    expect(Array.isArray(body.users)).toBeTruthy();
    expect(Array.isArray(body.stats)).toBeTruthy();
    expect(Array.isArray(body.userLevels)).toBeTruthy();
  }

  // Validate users array shape; only assert presence of keys (not values)
  static validateUsers(users: any[]) {
    expect(Array.isArray(users)).toBeTruthy();
    if (users.length === 0) return; // nothing more to assert

    const u = users[0];
    expect(u).toHaveProperty('user_id');
    expect(u).toHaveProperty('username');
    expect(u).toHaveProperty('display_name');
    expect(u).toHaveProperty('user_level_code');
    expect(u).toHaveProperty('status');
  }

  // Validate stats array shape
  static validateStats(stats: any[]) {
    expect(Array.isArray(stats)).toBeTruthy();
    if (stats.length === 0) return;

    const s = stats[0];
    expect(s).toHaveProperty('label');
    expect(s).toHaveProperty('value');
  }

  // Validate userLevels array shape
  static validateUserLevels(userLevels: any[]) {
    expect(Array.isArray(userLevels)).toBeTruthy();
    if (userLevels.length === 0) return;

    const l = userLevels[0];
    expect(l).toHaveProperty('level_code');
    expect(l).toHaveProperty('level_name');
    expect(l).toHaveProperty('sort_order');
  }

  // Convenience wrapper to validate the full response body for this endpoint
  static validateUsersResponse(body: any) {
    this.validateEndpointStructure(body);
    this.validateUsers(body.users);
    this.validateStats(body.stats);
    this.validateUserLevels(body.userLevels);
  }
}