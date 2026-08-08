import { test, expect } from "@fixtures/api_fixture";
import { API_CONFIG } from "@environment/environment.config";
import { bulkUploadData } from "@data/exam_marks_data";
import { ExcelHelper } from "@helper/excel_helper";

test.describe.serial('POST /api/admin/exam-marks/import - Bulk Upload Test Suite', () => {
  let token: string;

  test('1. Login and capture token', async ({ authClient }) => {
    const response = await authClient.login(API_CONFIG.credentials);
    expect(response.status()).toBe(200);

    const body = await response.json();
    token = body.token || body.data?.token;
  });

  test('Bulk Upload - TC02: Fail bulk upload when required query parameter (examTypeCode) is missing', async ({ examClient }) => {
    const excelBuffer = ExcelHelper.generateExcelBuffer(bulkUploadData.bulkStudentsList);

    const invalidPayload = {
      ...bulkUploadData.defaultParams,
      examTypeCode: '',
      fileBuffer: excelBuffer,
      fileName: 'bulk-upload-missing-type.xlsx'
    };

    const response = await examClient.importExamMarks(token, invalidPayload);
    expect([400, 422]).toContain(response.status());
  });

  test('Bulk Upload - TC03: Fail bulk upload when sending corrupted non-Excel binary data', async ({ examClient }) => {
    const corruptedBuffer = ExcelHelper.generateCorruptedBuffer();

    const invalidPayload = {
      ...bulkUploadData.defaultParams,
      fileBuffer: corruptedBuffer,
      fileName: 'bulk-upload-invalid-format.xlsx'
    };

    const response = await examClient.importExamMarks(token, invalidPayload);
    expect([400, 422, 500]).toContain(response.status());
  });
});