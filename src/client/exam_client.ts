import { ApiClient } from "./api_client.js";

export class ExamClient extends ApiClient {
  async getExams(token: string) {
    return await this.get('admin/exams', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': '*/*'
      }
    });
  }

  async createExam(token: string, payload: object) {
    return await this.post('admin/exams', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': '*/*'
      },
      data: payload
    });
  }

  async addExamMarks(token: string, payload: object) {
    return await this.post('admin/exam-marks', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': '*/*'
      },
      data: payload
    });
  }

  async getExamMarks(token: string, params: Record<string, any>) {
    const headers: Record<string, string> = {
      'Accept': '*/*',
      'Accept-Language': 'en-US,en;q=0.9,si;q=0.8',
      'Referer': 'http://75.119.154.239/admin'
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return await this.get('admin/exam-marks', {
      headers,
      params
    });
  }

  async importExamMarks(token: string, payload: any) {
    const { fileBuffer, fileName, ...queryParams } = payload;

    return await this.post('admin/exam-marks/import', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': '*/*'
      },
      params: {
        examTypeCode: queryParams.examTypeCode ?? '',
        alYear: queryParams.alYear ?? '',
        examNumber: queryParams.examNumber ?? '',
        examLocation: queryParams.examLocation ?? ''
      },
      multipart: {
        examTypeCode: queryParams.examTypeCode ?? '',
        alYear: queryParams.alYear ?? '',
        examNumber: queryParams.examNumber ?? '',
        examLocation: queryParams.examLocation ?? '',
        file: {
          name: fileName || 'bulk-upload.xlsx',
          mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          buffer: fileBuffer
        }
      }
    });
  }
}