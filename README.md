# API Lab – VS Code Extension

API Lab is a lightweight Visual Studio Code extension for creating, executing, and inspecting HTTP/HTTPS requests directly inside the editor.  
It helps developers test and debug APIs without switching to external tools.

---

## Features

- Execute HTTP/HTTPS requests from `.http` files
- Supports common HTTP methods (GET, POST, PUT, DELETE)
- Custom headers and JSON request bodies
- Environment variable substitution using `{{VAR_NAME}}`
- Authenticated requests via standard HTTP headers (e.g., Bearer tokens)
- Webview-based response viewer displaying:
  - Status code
  - Response headers
  - Response body
  - Request latency

---

## Installation

### Option 1: Install via VSIX (Recommended)

1. Download the `.vsix` file
2. Open VS Code
3. Go to **Extensions**
4. Click the `…` menu → **Install from VSIX**
5. Select the file and reload VS Code

### Option 2: Run from Source (Development)

1. Clone the repository
2. Open the project in VS Code
3. Press **F5** to launch the Extension Development Host

---

## Usage

### 1. Create a request file

Create a file with the `.http` extension:

```http
GET https://httpbin.org/get
Accept: application/json
```

---

### 2. Run the request

1. Click inside the `.http` file
2. Press **Ctrl + Shift + P**
3. Run:

```
API Lab: Send HTTP Request
```

---

### 3. View the response

The response opens in a side panel showing:
- Status code
- Response headers
- Response body (formatted JSON if applicable)
- Time taken for the request

---

##  Environment Variables

API Lab supports environment-based configuration using a JSON file.

### Create `api-lab.env.json` in the workspace root:

```json
{
  "BASE_URL": "https://jsonplaceholder.typicode.com",
  "TOKEN": "example-token"
}
```

### Use variables in requests:

```http
GET {{BASE_URL}}/posts/1
Authorization: Bearer {{TOKEN}}
Accept: application/json
```

This allows the same request definitions to be reused across different environments such as development, QA, and production.

---

## Authentication

Authentication is handled via standard HTTP headers.

Example (Bearer token):

```http
Authorization: Bearer {{TOKEN}}
```

Secrets can be externalized using environment variables to avoid hardcoding sensitive values.

---

##  Design Overview

High-level flow:

```
Editor (.http file)
   ↓
Command Palette
   ↓
Request Parser
   ↓
HTTP Client (Axios)
   ↓
Response
   ↓
Webview Renderer
```

The extension is designed with separation of concerns and can be extended with additional features such as request collections or assertions.

---

## Tech Stack

- TypeScript
- VS Code Extension API
- Axios
- Webviews
- Webpack

---

##  Error Handling

API Lab clearly differentiates between:
- HTTP errors (non-2xx responses)
- Network failures (request sent but no response received)
- Invalid request definitions

Errors are reported to the user with clear messages instead of failing silently.

---

##  Why API Lab?

API Lab is built as a developer-first tool focused on productivity.  
It integrates API testing directly into the editor, enabling faster feedback loops and a smoother development workflow.
