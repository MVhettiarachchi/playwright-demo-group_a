import { test, expect } from "../src/fixtures/api_fixture.js";
import { API_CONFIG } from "../src/config/config.js";
import { ApiHelper } from "../src/helper/api_helper.js";
import { AppState } from "../src/environment/state.js";
import { examData } from "../src/data/exams.js";

test.describe.serial('Exam API - Full E2E Workflow', () => {

  // Dynamically generate unique identifiers per run
  const uniqueId = Date.now().toString().slice(-4);
  const testPayload = {
    ...examData.testExamPayload,
    examNumber: uniqueId,
    examTitle: `2026 Second Term Exam ${uniqueId}`
  };

  test('1. Login to application', async ({ apiClient }) => {
    const response = await apiClient.login(API_CONFIG.credentials);
    const body = await ApiHelper.validateAndParse(response, 200);
    
    AppState.token = body.token || body.data?.token;
    expect(AppState.token).toBeTruthy();
  });

  test('2. Get initial exam list', async ({ apiClient }) => {
    const response = await apiClient.getExams(AppState.token);
    const body = await ApiHelper.validateAndParse(response, 200);
    
    const exams = Array.isArray(body) ? body : (body.data || body.exams || body.content || []);
    expect(Array.isArray(exams)).toBeTruthy();
  });

  test('3. Create a new exam', async ({ apiClient }) => {
    const response = await apiClient.createExam(AppState.token, testPayload);
    expect([200, 201]).toContain(response.status());
  });

  test('4. Attempt creating same exam to check for duplicate error', async ({ apiClient }) => {
    const response = await apiClient.createExam(AppState.token, testPayload);
    
    expect([400, 409]).toContain(response.status());
    
    const errorBody = await response.json();
    expect(JSON.stringify(errorBody)).toMatch(/already exists|duplicate/i);
  });

  test('5. Fetch exams and verify created details', async ({ apiClient }) => {
    const response = await apiClient.getExams(AppState.token);
    const body = await ApiHelper.validateAndParse(response, 200);

    const examsList = Array.isArray(body) ? body : (body.data || body.exams || body.content || []);

    const createdExam = examsList.find((exam: any) =>
      exam.exam_title === testPayload.examTitle ||
      exam.examTitle === testPayload.examTitle ||
      String(exam.exam_number) === String(testPayload.examNumber) ||
      String(exam.examNumber) === String(testPayload.examNumber)
    );

    expect(createdExam).toBeDefined();

    const actualTypeCode = createdExam.exam_type_code || createdExam.examTypeCode;
    const actualLocation = createdExam.exam_location || createdExam.examLocation;

    expect(actualTypeCode).toBe(testPayload.examTypeCode);
    expect(actualLocation).toBe(testPayload.examLocation);
  });

  test('6. Submit marks for the newly created exam', async ({ apiClient }) => {
    const examMarkPayload = {
      examTypeCode: testPayload.examTypeCode || 'PCE',
      alYear: '2026',
      examNumber: String(testPayload.examNumber),
      examLocation: testPayload.examLocation || 'Dekma-Matara',
      studentId: 'STU-KNS',
      mark: 50
    };

    const response = await apiClient.addExamMarks(AppState.token, examMarkPayload);
    const body = await ApiHelper.validateAndParse(response, [200, 201]);

    ApiHelper.validateExamMarksResponse(body);
  });

  test('7. Attempt submitting invalid marks to check error handling', async ({ apiClient }) => {
    const invalidMarkPayload = {
      examTypeCode: testPayload.examTypeCode || 'PCE',
      alYear: '2026',
      examNumber: String(testPayload.examNumber),
      examLocation: testPayload.examLocation || 'Dekma-Matara',
      studentId: 'STU-KNS',
      mark: -15
    };

    const response = await apiClient.addExamMarks(AppState.token, invalidMarkPayload);
    await ApiHelper.validateErrorResponse(response, 400);
  });

  test('8. Fetch exam marks with query parameters', async ({ apiClient }) => {
    const queryParams = {
      examTypeCode: testPayload.examTypeCode || 'PCE',
      alYear: '2026',
      examNumber: String(testPayload.examNumber),
      examLocation: testPayload.examLocation || 'Dekma-Matara'
    };

    const response = await apiClient.getExamMarks(AppState.token, queryParams);
    const body = await ApiHelper.validateAndParse(response, [200, 304]);

    expect(body).toBeTruthy();
  });

});