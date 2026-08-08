import * as XLSX from 'xlsx';

export class ExcelHelper {
  /**
   * Generates an in-memory Excel (.xlsx) file buffer from dynamic JSON rows
   */
  static generateExcelBuffer(rows: Array<Record<string, any>>, sheetName = 'BulkUploadMarks'): Buffer {
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  }

  /**
   * Returns a corrupted plain-text buffer to test error handling
   */
  static generateCorruptedBuffer(): Buffer {
    return Buffer.from('INVALID_CORRUPTED_BULK_UPLOAD_DATA');
  }
}