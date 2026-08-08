import { type APIRequestContext } from "@playwright/test";
import { API_CONFIG } from "../config/config.js";

export interface ExamMarkPayload {
  examTypeCode: string;
  alYear: string;
  examNumber: string;
  examLocation: string;
  studentId: string;
  mark: number;
}

export interface ExamMarkQueryParams {
  examTypeCode: string;
  alYear: string;
  examNumber: string;
  examLocation: string;
}

export interface ImportExamMarksPayload {
  examTypeCode: string;
  alYear: string;
  examNumber: string;
  examLocation: string;
  fileBuffer: Buffer;
  fileName?: string;
  mimeType?: string;
}

export class ApiClient {
  protected requestContext: APIRequestContext;

  constructor(requestContext: APIRequestContext) {
    this.requestContext = requestContext;
  }

  // Auth
  async login(credentials: object) {
    return await this.requestContext.post('auth/login', { 
      data: credentials 
    });
  }

  async getProfile(token: string) {
    return await this.requestContext.get('admin/profile', { 
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  // Users
  async activeUser(userId: string, token: string) {
    return await this.requestContext.patch(
      `admin/users/${userId}/status`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        data: API_CONFIG.activeUserPayload
      }
    );
  }

  async createUser(token: string, userData: object) {
    return await this.requestContext.post('admin/users', { 
      headers: {
        'Authorization': `Bearer ${token}`
      },
      data: userData 
    });
  }

  async getUsers(token: string) {
    return await this.requestContext.get('admin/users', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  async updateUserStatus(token: string, userId: string, status: 'active' | 'inactive') {
    return await this.requestContext.patch(`admin/users/${userId}/status`, { 
      headers: {
        'Authorization': `Bearer ${token}`
      },
      data: { status }
    });
  }

  async updateUser(token: string, userId: string, userData: Record<string, any>) {
    return await this.requestContext.put(`admin/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      data: userData
    });
  }

  // GET /api/admin/exams
  async getExams(token: string) {
    return await this.requestContext.get('admin/exams', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': '*/*'
      }
    });
  }

  // POST /api/admin/exams
  async createExam(token: string, payload: object) {
    return await this.requestContext.post('admin/exams', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': '*/*'
      },
      data: payload
    });
  }

  // POST /api/admin/exam-marks
  async addExamMarks(token: string, payload: ExamMarkPayload | object) {
    return await this.requestContext.post('admin/exam-marks', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': '*/*'
      },
      data: payload
    });
  }

  // GET /api/admin/exam-marks
  async getExamMarks(token: string, params: ExamMarkQueryParams) {
    const headers: Record<string, string> = {
      'Accept': '*/*',
      'Accept-Language': 'en-US,en;q=0.9,si;q=0.8',
      'Referer': 'http://75.119.154.239/admin'
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return await this.requestContext.get('admin/exam-marks', {
      headers,
      params: {
        examTypeCode: params.examTypeCode,
        alYear: params.alYear,
        examNumber: params.examNumber,
        examLocation: params.examLocation
      }
    });
  }

  // POST /api/admin/exam-marks/import (NEW METHOD)
  async importExamMarks(token: string, payload: ImportExamMarksPayload) {
    const headers: Record<string, string> = {
      'Accept': '*/*',
      'Referer': 'http://75.119.154.239/admin'
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return await this.requestContext.post('admin/exam-marks/import', {
      headers,
      multipart: {
        examTypeCode: payload.examTypeCode,
        alYear: payload.alYear,
        examNumber: payload.examNumber,
        examLocation: payload.examLocation,
        file: {
          name: payload.fileName || 'bulk-upload.xlsx',
          mimeType: payload.mimeType || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          buffer: payload.fileBuffer
        }
      }
    });
  }
}