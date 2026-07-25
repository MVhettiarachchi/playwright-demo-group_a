# Playwright API Automation - Demo

This repository contains a small Playwright-based API automation sample used to test an admin users endpoint.

## Purpose

- Provide a clear example of structuring API tests with Playwright's `@playwright/test` fixtures.
- Centralize HTTP calls in a client class and reuse helpers for validation.

## Repository Structure

- `playwright.config.ts` - Playwright configuration (testDir, reporter, timeouts).
- `src/client/api_client.ts` - `ApiClient` class: wrapper for API calls (`login`, `getProfile`, `getUsers`).
- `src/fixtures/api_fixture.ts` - fixture that creates `apiClient` for tests.
- `src/helper/api_helper.ts` - helper utilities (response validation and parsing).
- `src/config/config.ts` - base URL and default credentials used by tests.
- `src/environment/state.ts` - simple in-memory storage for sharing state (e.g., token).
- `tests/` - Playwright test files. Example: `tests/users.api.test.spec.ts`.

## How to Run

1. From the project root (`D:\qa_automation\playwright-demo`) install dependencies:

```powershell
npm install
npx playwright install
```

2. Run all tests:

```powershell
npx playwright test
```

3. Run a single test file:

```powershell
npx playwright test tests/users.api.test.spec.ts
```

## How Tests Are Organized

- Tests receive `apiClient` from the fixture in `src/fixtures/api_fixture.ts`.
- `ApiClient` keeps requests consistent by using Playwright's `APIRequestContext` with `baseURL` from `src/config/config.ts`.
- `ApiHelper.validateAndParse(response, expectedStatus)` asserts the response status and returns parsed JSON.

## Where to Add Explanations

Add project-specific notes or explanations under the sections below — keep entries short and focused.

### Clients

- Document why methods exist, expected request/response shapes, and any authentication behavior.

### Fixtures

- Describe custom fixtures and their lifetimes (per-test, per-worker), and how they should be used.

### Helpers

- Record shared utilities and common assertions used across tests.

### Tests

- For each test file, add a short summary of the scenarios covered and any required test data or setup.

## Coding & Style Notes

- Keep HTTP interactions inside `ApiClient`.
- Use `ApiHelper` for reusable assertions and parsing.
- Prefer small, focused tests that assert one behavior per test.

## Troubleshooting

- "No tests found": ensure you run `npx playwright test` from the project root and that `playwright.config.ts` points to `./tests`.
- "Cannot find package '@playwright/test'": run `npm install` in the project root.

## Next Steps (Suggestions)

- Add more tests for create/update/delete user flows.
- Enhance assertions to validate specific fields returned by `admin/users`.

---

Edit this file to add more project-specific documentation and explanations for future maintainers.
