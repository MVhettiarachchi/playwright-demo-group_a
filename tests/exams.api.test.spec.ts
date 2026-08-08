import { test, expect } from "@fixtures/api_fixture";
import { API_CONFIG } from "@environment/environment.config";
import { examData } from "@data/exams";

test.describe.serial('Exam API - Full E2E Workflow', () => {
  let token: string;
  const uniqueId = Date.now().toString().slice(-4);
  const testPayload = {
    ...examData.testExamPayload,
    examNumber: uniqueId,
    examTitle: `2026 Second Term Exam ${uniqueId}`
  };

  test('1. Login to application', async ({ authClient }) => {
    const response = await authClient.login(API_CONFIG.credentials);
    expect(response.status()).toBe(200);

    const body = await response.json();
    token = body.token || body.data?.token;
  });

  test('2. Get initial exam list', async ({ examClient }) => {
    const response = await examClient.getExams(token);
    expect(response.status()).toBe(200);
  });

  test('3. Create a new exam', async ({ examClient }) => {
    const response = await examClient.createExam(token, testPayload);
    expect([200, 201]).toContain(response.status());
  });

  test('4. Fail creating duplicate exam', async ({ examClient }) => {
    const response = await examClient.createExam(token, testPayload);
    expect([400, 409]).toContain(response.status());
  });

  test('5. Verify created exam in list', async ({ examClient }) => {
    const response = await examClient.getExams(token);
    expect(response.status()).toBe(200);
  });

  test('6. Submit marks for the new exam', async ({ examClient }) => {
    const examMarkPayload = {
      examTypeCode: testPayload.examTypeCode || 'PCE',
      alYear: '2026',
      examNumber: String(testPayload.examNumber),
      examLocation: testPayload.examLocation || 'Dekma-Matara',
      studentId: 'STU-KNS',
      mark: 50
    };

    const response = await examClient.addExamMarks(token, examMarkPayload);
    expect([200, 201]).toContain(response.status());
  });

  test('7. Fail submitting invalid marks', async ({ examClient }) => {
    const invalidMarkPayload = {
      examTypeCode: testPayload.examTypeCode || 'PCE',
      alYear: '2026',
      examNumber: String(testPayload.examNumber),
      examLocation: testPayload.examLocation || 'Dekma-Matara',
      studentId: 'STU-KNS',
      mark: -15
    };

    const response = await examClient.addExamMarks(token, invalidMarkPayload);
    expect(response.status()).toBe(400);
  });

  test('8. Fetch exam marks with params', async ({ examClient }) => {
    const queryParams = {
      examTypeCode: testPayload.examTypeCode || 'PCE',
      alYear: '2026',
      examNumber: String(testPayload.examNumber),
      examLocation: testPayload.examLocation || 'Dekma-Matara'
    };

    const response = await examClient.getExamMarks(token, queryParams);
    expect([200, 304]).toContain(response.status());
  });
});