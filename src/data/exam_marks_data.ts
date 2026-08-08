export const bulkUploadData = {
  defaultParams: {
    examTypeCode: 'PCE',
    alYear: '2026',
    examNumber: '4910',
    examLocation: 'Dekma-Matara'
  },
  // Adjust key names below to match your backend Excel template headers
  bulkStudentsList: [
    { 'Student ID': 'STU-101', 'Mark': 85 },
    { 'Student ID': 'STU-102', 'Mark': 92 },
    { 'Student ID': 'STU-103', 'Mark': 78 },
    { 'Student ID': 'STU-104', 'Mark': 88 },
    { 'Student ID': 'STU-105', 'Mark': 95 }
  ]
};