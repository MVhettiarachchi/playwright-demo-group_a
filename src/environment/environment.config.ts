export const API_CONFIG = {
  baseURL: process.env.BASE_URL || 'http://75.119.154.239/api/',
  credentials: {
    identifier: process.env.API_USER || 'groupa',
    password: process.env.API_PASSWORD || '123456',
    portal: process.env.API_PORTAL || 'admin',
  },
  activeUserPayload: {
    status: 'active',
  },
} as const;