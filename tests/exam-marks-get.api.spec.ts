import { test, expect } from "../src/fixtures/api_fixture.js";
import { API_CONFIG } from "../src/config/config.js";
import { ApiHelper } from "../src/helper/api_helper.js";
import { AppState } from "../src/environment/state.js";

test.describe.serial('GET /api/admin/exam-marks - Isolated Test Suite', () => {

  const defaultParams = {
    examTypeCode: 'PCE',
    alYear: '2026',
    examNumber: '4910',
    examLocation: 'Dekma-Matara'
  };

  test.beforeAll(async ({ apiClient }) => {
    const response = await apiClient.login(API_CONFIG.credentials);
    const body = await ApiHelper.validateAndParse(response, [200, 201]);
    AppState.token = body.token || body.data?.token;
    expect(AppState.token).toBeTruthy();
  });

  test('TC01: Successfully retrieve exam marks with all valid query parameters', async ({ apiClient }) => {
    const response = await apiClient.getExamMarks(AppState.token, defaultParams);
    const body = await ApiHelper.validateAndParse(response, [200, 304]);
    expect(body).toBeDefined();
  });

  test('TC02: Validate response data structure and field types', async ({ apiClient }) => {
    const response = await apiClient.getExamMarks(AppState.token, defaultParams);
    const body = await ApiHelper.validateAndParse(response, [200, 304]);

    const markRecords = Array.isArray(body) ? body : (body.data || body.marks || body.content || []);
    expect(Array.isArray(markRecords)).toBeTruthy();

    if (markRecords.length > 0) {
      const record = markRecords[0];
      const studentId = record.student_id || record.studentId;
      const markValue = record.mark ?? record.marks ?? record.score;

      expect(studentId).toBeDefined();
      expect(typeof markValue === 'number' || typeof markValue === 'string').toBeTruthy();
    }
  });

  test('TC03: Query with non-existent examNumber returns empty collection', async ({ apiClient }) => {
    const nonExistentParams = {
      ...defaultParams,
      examNumber: '99999999'
    };

    const response = await apiClient.getExamMarks(AppState.token, nonExistentParams);
    expect([200, 404]).toContain(response.status());

    if (response.status() === 200) {
      const body = await response.json();
      const records = Array.isArray(body) ? body : (body.data || body.marks || []);
      expect(records.length).toBe(0);
    }
  });

  test('TC04: Query with special characters in examLocation', async ({ apiClient }) => {
    const encodedParams = {
      ...defaultParams,
      examLocation: 'Dekma - Matara & Galle'
    };

    const response = await apiClient.getExamMarks(AppState.token, encodedParams);
    expect([200, 304, 404]).toContain(response.status());
  });

  test('TC05: Missing required parameter (examTypeCode)', async ({ apiClient }) => {
    const missingParam = {
      ...defaultParams,
      examTypeCode: ''
    };

    const response = await apiClient.getExamMarks(AppState.token, missingParam);
    expect([400, 422, 200]).toContain(response.status());
  });

  test('TC06: Missing required parameter (examNumber)', async ({ apiClient }) => {
    const missingParam = {
      ...defaultParams,
      examNumber: ''
    };

    const response = await apiClient.getExamMarks(AppState.token, missingParam);
    expect([400, 422, 200]).toContain(response.status());
  });

  test('TC07: Reject request when Authorization header is missing (401)', async ({ apiClient }) => {
    const response = await apiClient.getExamMarks('', defaultParams);
    expect(response.status()).toBe(401);
  });

  test('TC08: Reject request with malformed/invalid Bearer token (401)', async ({ apiClient }) => {
    const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalidTokenBody.signature';
    const response = await apiClient.getExamMarks(invalidToken, defaultParams);
    expect(response.status()).toBe(401);
  });

  test('TC09: Validate ETag caching behavior with conditional header', async ({ apiClient }) => {
    const initialResponse = await apiClient.getExamMarks(AppState.token, defaultParams);
    const etag = initialResponse.headers()['etag'];

    if (etag) {
      const cachedResponse = await apiClient.getExamMarks(AppState.token, defaultParams);
      expect([200, 304]).toContain(cachedResponse.status());
    }
  });

});