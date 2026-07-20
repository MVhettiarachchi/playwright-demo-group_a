import { expect, type APIResponse } from "@playwright/test";

export class ApiHelper {
  // Common utility to validate responses and parse JSON safely
  static async validateAndParse(response: APIResponse, expectedStatus: number = 200) {
    expect(response.status()).toBe(expectedStatus);
    return await response.json();
  }
}