# API Automation Test Suite (Playwright & TypeScript)

A robust API testing framework built with **Playwright**, **TypeScript**, and **Allure Reporting**, integrated into a **Jenkins CI/CD** pipeline. This framework utilizes a Page Object/Domain Client model backed by custom Playwright fixtures to validate authentication, user management, exam creation, and Excel bulk upload workflows.

---

## 📊 Latest Execution Summary

* **Execution Platform:** Jenkins CI/CD (`api-automation-playwright-group-a`)
* **Total Tests:** 33
* **Pass Rate:** 100% (33 Passed, 0 Failed)
* **Reporting:** Allure Interactive Dashboard

### Test Suites Overview

| Test Suite | Description | Test Count | Result |
| --- | --- | --- | --- |
| **Exam API - Full E2E Workflow** | End-to-end exam creation, mark assignments, and verification | 8 | ✅ Pass |
| **GET /api/admin/exam-marks** | Parametrized search, filtering, and authorization validation | 7 | ✅ Pass |
| **User Deactivation API Tests** | User status updates (`active` / `inactive`) | 5 | ✅ Pass |
| **Update User Profile API Tests** | Modifying user metadata and administrative profile controls | 4 | ✅ Pass |
| **POST /api/admin/exam-marks/import** | Excel buffer upload validation and file handling | 3 | ✅ Pass |
| **Sample API - Profile Management** | User profile fetching and sanity checks | 2 | ✅ Pass |
| **Sample API - Authentication** | Token acquisition and login verification | 1 | ✅ Pass |
| **Sample API - Active User Management** | Status endpoint checks | 1 | ✅ Pass |
| **Admin Management - User Creation** | Provisioning new user entities | 1 | ✅ Pass |
| **Other Core Suites** | Helper utilities and security checks | 1 | ✅ Pass |

---

## 🏗️ Framework Architecture

```
playwright-demo/
├── src/
│   ├── client/           # Domain API clients (ApiClient, UserClient, ExamClient, AuthClient)
│   ├── data/             # Test payloads, JSON mock data, and parameter maps
│   ├── environment/      # Base URLs, credentials, and configuration
│   ├── fixtures/         # Dependency injection fixtures (api_fixture.ts)
│   └── helper/           # Dynamic Excel generation and response validators
└── tests/                # Feature test spec files (*.spec.ts)

```

---

## 🚀 Getting Started

### 1. Prerequisites

* **Node.js** (v18 or higher)
* **npm** (v9 or higher)

### 2. Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd playwright-demo
npm install

```

---

## 💻 Running Tests

### Run All Test Specs

```bash
npx playwright test

```

### Run a Specific Test Suite

```bash
npx playwright test tests/bulk-upload.api.spec.ts

```

### Run Tests by Title Keyword

```bash
npx playwright test -g "Bulk Upload"

```

### Interactive UI / Debug Mode

```bash
npx playwright test --ui

```

---

## 📈 Reporting & CI/CD Integration

### Playwright Built-in HTML Report

To view the standard Playwright report locally:

```bash
npx playwright show-report

```

### Allure Reporting (Local)

Generate and open the Allure interactive dashboard locally:

```bash
# Generate Allure results
npx allure generate allure-results --clean -o allure-report

# Open interactive dashboard
npx allure open allure-report

```

### Jenkins Pipeline Setup

This suite runs automatically on Jenkins build triggers:

1. Jenkins executes `npx playwright test`.
2. Playwright outputs results to `allure-results/`.
3. The Jenkins Allure plugin aggregates metrics and publishes the dashboard at `/job/api-automation-playwright-group-a/<build_id>/allure/`.



<img width="953" height="493" alt="image" src="https://github.com/user-attachments/assets/fc56d6cb-0c60-4649-ba39-cb9e5d181212" />

