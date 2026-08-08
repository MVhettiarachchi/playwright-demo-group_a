import { test, expect } from "@fixtures/api_fixture";
import { API_CONFIG } from "@environment/environment.config";

test.describe.serial('GET /api/admin/exam-marks - Isolated Test Suite', () => {
  let token: string;

  const defaultParams = {
    examTypeCode: 'PCE',
    alYear: '2026',
    examNumber: '4910',
    examLocation: 'Dekma-Matara'
  };

  test('1. Login and capture token', async ({ authClient }) => {
    const response = await authClient.login(API_CONFIG.credentials);
    expect(response.status()).toBe(200);

    const body = await response.json();
    token = body.token || body.data?.token;
  });

  test('2. Successfully retrieve exam marks', async ({ examClient }) => {
    const response = await examClient.getExamMarks(token, defaultParams);
    expect([200, 304]).toContain(response.status());
  });

  test('3. Query with non-existent examNumber', async ({ examClient }) => {
    const response = await examClient.getExamMarks(token, {
      ...defaultParams,
      examNumber: '99999999'
    });
    expect([200, 404]).toContain(response.status());
  });

  test('4. Query with special characters in location', async ({ examClient }) => {
    const response = await examClient.getExamMarks(token, {
      ...defaultParams,
      examLocation: 'Dekma - Matara & Galle'
    });
    expect([200, 304, 404]).toContain(response.status());
  });

  test('5. Query with missing required parameter', async ({ examClient }) => {
    const response = await examClient.getExamMarks(token, {
      ...defaultParams,
      examTypeCode: ''
    });
    expect([400, 422, 200]).toContain(response.status());
  });

  test('6. Fail request without authorization token', async ({ examClient }) => {
    const response = await examClient.getExamMarks('', defaultParams);
    expect(response.status()).toBe(401);
  });

  test('7. Fail request with invalid token', async ({ examClient }) => {
    const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalidTokenBody.signature';
    const response = await examClient.getExamMarks(invalidToken, defaultParams);
    expect(response.status()).toBe(401);
  });
});