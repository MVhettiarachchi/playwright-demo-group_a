import { expect, type APIResponse } from "@playwright/test";

export class ApiHelper {
  // Common utility to validate responses and parse JSON safely
  static async validateAndParse(
    response: APIResponse, 
    expectedStatus: number | number[] = [200, 201]
  ) {
    if (Array.isArray(expectedStatus)) {
      expect(expectedStatus).toContain(response.status());
    } else {
      expect(response.status()).toBe(expectedStatus);
    }
    return await response.json();
  }

  // Common utility to validate non-200 error responses
  static async validateErrorResponse(
    response: APIResponse, 
    expectedStatus: number | number[]
  ) {
    if (Array.isArray(expectedStatus)) {
      expect(expectedStatus).toContain(response.status());
    } else {
      expect(response.status()).toBe(expectedStatus);
    }
    const body = await response.json();
    expect(body).toBeTruthy();
    return body;
  }

  static validateEndpointStructure(body: any) {
    expect(body).toBeTruthy();
    expect(body).toHaveProperty('users');
    expect(body).toHaveProperty('stats');
    expect(body).toHaveProperty('userLevels');

    expect(Array.isArray(body.users)).toBeTruthy();
    expect(Array.isArray(body.stats)).toBeTruthy();
    expect(Array.isArray(body.userLevels)).toBeTruthy();
  }

  static validateUsers(users: any[]) {
    expect(Array.isArray(users)).toBeTruthy();
    if (users.length === 0) return;

    const u = users[0];
    expect(u).toHaveProperty('user_id');
    expect(u).toHaveProperty('username');
    expect(u).toHaveProperty('display_name');
    expect(u).toHaveProperty('user_level_code');
    expect(u).toHaveProperty('status');
  }

  static validateStats(stats: any[]) {
    expect(Array.isArray(stats)).toBeTruthy();
    if (stats.length === 0) return;

    const s = stats[0];
    expect(s).toHaveProperty('label');
    expect(s).toHaveProperty('value');
  }

  static validateUserLevels(userLevels: any[]) {
    expect(Array.isArray(userLevels)).toBeTruthy();
    if (userLevels.length === 0) return;

    const l = userLevels[0];
    expect(l).toHaveProperty('level_code');
    expect(l).toHaveProperty('level_name');
    expect(l).toHaveProperty('sort_order');
  }

  static validateUsersResponse(body: any) {
    this.validateEndpointStructure(body);
    this.validateUsers(body.users);
    this.validateStats(body.stats);
    this.validateUserLevels(body.userLevels);
  }

  static validateExamMarksResponse(body: any) {
    expect(body).toBeTruthy();
  }
}