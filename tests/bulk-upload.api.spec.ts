import { test, expect } from "../src/fixtures/api_fixture.js";
import { API_CONFIG } from "../src/config/config.js";
import { ApiHelper } from "../src/helper/api_helper.js";
import { AppState } from "../src/environment/state.js";
import { bulkUploadData } from "../src/data/exam_marks_data.js";
import { ExcelHelper } from "../src/helper/excel_helper.js";

test.describe('POST /api/admin/exam-marks/import - Bulk Upload Test Suite', () => {

  test.beforeAll(async ({ apiClient }) => {
    const response = await apiClient.login(API_CONFIG.credentials);
    const body = await ApiHelper.validateAndParse(response, [200, 201]);
    AppState.token = body.token || body.data?.token;
    expect(AppState.token).toBeTruthy();
  });

  // ---------------------------------------------------------------------------
  // 1. HAPPY PATH
  // ---------------------------------------------------------------------------

  test('Bulk Upload - TC01: Successfully perform bulk upload using ExcelHelper buffer', async ({ apiClient }) => {
    const excelBuffer = ExcelHelper.generateExcelBuffer(bulkUploadData.bulkStudentsList);

    const uploadPayload = {
      ...bulkUploadData.defaultParams,
      fileBuffer: excelBuffer,
      fileName: `bulk-upload-exam-marks-${Date.now()}.xlsx`
    };

    const response = await apiClient.importExamMarks(AppState.token, uploadPayload);
    
    // Debug outputs
    console.log('\n--- [TC01] API Response ---');
    console.log('Status Code:', response.status());
    console.log('Response Body:', await response.text());

    expect([200, 201]).toContain(response.status());
  });

  // ---------------------------------------------------------------------------
  // 2. NEGATIVE PATHS
  // ---------------------------------------------------------------------------

  test('Bulk Upload - TC02: Fail bulk upload when required query parameter (examTypeCode) is missing', async ({ apiClient }) => {
    const excelBuffer = ExcelHelper.generateExcelBuffer(bulkUploadData.bulkStudentsList);

    const invalidPayload = {
      ...bulkUploadData.defaultParams,
      examTypeCode: '',
      fileBuffer: excelBuffer,
      fileName: 'bulk-upload-missing-type.xlsx'
    };

    const response = await apiClient.importExamMarks(AppState.token, invalidPayload);

    console.log('\n--- [TC02] API Response ---');
    console.log('Status Code:', response.status());

    expect([400, 422]).toContain(response.status());
  });

  test('Bulk Upload - TC03: Fail bulk upload when sending corrupted non-Excel binary data', async ({ apiClient }) => {
    const corruptedBuffer = ExcelHelper.generateCorruptedBuffer();

    const invalidPayload = {
      ...bulkUploadData.defaultParams,
      fileBuffer: corruptedBuffer,
      fileName: 'bulk-upload-invalid-format.xlsx'
    };

    const response = await apiClient.importExamMarks(AppState.token, invalidPayload);

    console.log('\n--- [TC03] API Response ---');
    console.log('Status Code:', response.status());

    expect([400, 422, 500]).toContain(response.status());
  });

});