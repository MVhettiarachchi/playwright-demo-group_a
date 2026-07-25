# User Deactivation API Automation Testing Documentation

This document provides a guide to the **User Deactivation and Reactivation** automation testing suite implemented for the UCSC Tuition Platform Admin API.

---

## 1. Target API Endpoints & Specifications

During our endpoint investigation, we analyzed the behavior of the admin user status update routes. The findings are detailed below:

### A. List All Users
* **Endpoint**: `GET /api/admin/users`
* **Headers**: 
  - `Authorization: Bearer <token>`
* **Description**: Returns all users in the system. Used to locate the target test user (`testing-25`) and verify their status before and after toggle operations.
* **Response Payload Shape**:
  ```json
  [
    {
      "user_id": "testing-25",
      "username": "testing-25",
      "display_name": "Good user",
      "status": "active",
      ...
    }
  ]
  ```

### B. Toggle User Status (Deactivate / Reactivate)
* **Endpoint**: `PATCH /api/admin/users/:userId/status`
* **Headers**:
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
* **Request Payload**:
  ```json
  {
    "status": "inactive"  // To deactivate
  }
  ```
  or
  ```json
  {
    "status": "active"    // To reactivate
  }
  ```
* **Response Payload (Deactivation)**:
  ```json
  {
    "message": "User deactivated"
  }
  ```
* **Response Payload (Reactivation)**:
  ```json
  {
    "message": "User activated"
  }
  ```

**Important Note on HTTP Methods:** 
- Calling `PUT` or `POST` on `/api/admin/users/:userId/status` will result in a `404 Not Found` error. 
- Calling `PUT` on `/api/admin/users/:userId/deactivate` or `/api/admin/users/:userId/activate` also returns a `404 Not Found` error.
- The API strictly requires the **`PATCH`** method on the `/status` endpoint.

---

## 2. Core Implementation Files

Three files were created/modified in the workspace (`playwright-demo`) to support this feature:

### 1. `src/client/api_client.ts`
Exposes the core API client methods including authentication and user status management:
```typescript
import { type APIRequestContext } from "@playwright/test";

export class ApiClient {
  protected requestContext: APIRequestContext;

  constructor(requestContext: APIRequestContext) {
    this.requestContext = requestContext;
  }

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

  async getAllUsers(token: string) {
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
}
```

### 2. `playwright.config.ts`
Configured to support automatic capturing of full API traces and headers:
```typescript
use: {
  baseURL: 'http://75.119.154.239/api/',
  trace: 'on',
  extraHTTPHeaders: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
}
```

### 3. `src/fixtures/api_fixture.ts`
Injects the base `apiClient` using the default request context to allow full trace mapping:
```typescript
export const test = base.extend<MyFixtures>({
  apiClient: async ({ request }, use) => {
    const client = new ApiClient(request);
    await use(client);
  }
});
```

---

## 3. Automated Test Suite Workflow (`tests/user_deactivation.spec.ts`)

The test suite runs in **serial mode** to prevent race conditions during database toggles and follows a 6-step verification lifecycle:

```
[TC-01: Authenticate & Retrieve User List]
                  │
                  ▼
[TC-02: Confirm Current User Status]
                  │
                  ▼
[TC-03: Execute Deactivation via PATCH]
                  │
                  ▼
[TC-04: Verify User is Inactive]
                  │
                  ▼
[TC-05: Execute Reactivation via PATCH]
                  │
                  ▼
[TC-06: Verify User is Active]
```

### Test Suite Execution Output
```
Running 6 tests using 1 worker

Token captured and saved in AppState.
Total users found in system: 50
Found target user: testing-25 (ID: testing-25)
  ✓ TC-01: Should GET all users successfully after login (1.3s)

User: testing-25 (testing-25)
Current Status: active
  ✓ TC-02: Should confirm target user current status (3ms)

Deactivating user: testing-25 (ID: testing-25)
Deactivation response: {"message":"User deactivated"}
  ✓ TC-03: Should DEACTIVATE the user (395ms)

CONFIRMED: testing-25 is now INACTIVE
  ✓ TC-04: Should VERIFY user is now INACTIVE (427ms)

Re-activating user: testing-25 (ID: testing-25)
Re-activation response: {"message":"User activated"}
  ✓ TC-05: Should RE-ACTIVATE the user (cleanup) (411ms)

COMPLETE: testing-25 -> ACTIVE -> INACTIVE -> ACTIVE
  ✓ TC-06: Should VERIFY user is back to ACTIVE (327ms)

  6 passed (4.2s)
```

---

## 4. How To Run & View Traces

### Run the Tests
Execute the command below in the project root:
```bash
npx playwright test tests/user_deactivation.spec.ts
```

To see the detailed, step-by-step progress list:
```bash
npx playwright test tests/user_deactivation.spec.ts --reporter=list
```

### View Traces and Reports
1. **Show Report**:
   ```bash
   npx playwright show-report
   ```
2. **Explore Traces**:
   - In the browser window that opens up, click on any of the test cases (e.g., `TC-03: Should DEACTIVATE the user`).
   - Scroll down to the **Traces** section and click on the trace icon.
   - You will see the complete timeline of the API requests, including Request Headers, Request Body payloads, Response Statuses, and Response Bodies.
