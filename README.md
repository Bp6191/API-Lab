# API Lab – VS Code Extension

API Lab is a lightweight Visual Studio Code extension for creating, executing, and inspecting HTTP/HTTPS requests directly inside the editor.  
It helps developers test and debug APIs without switching to external tools.

---
## Tech Stack

- TypeScript
- VS Code Extension API
- Axios
- Webviews
- Webpack
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

# Usage

## 1. Create a request file

Create a file with the `.http` extension:

### HTTP Request Examples (API Lab)

---

## GET Requests

Retrieve data from a server.

### Basic GET Request
```http
GET https://jsonplaceholder.typicode.com/posts/1
Accept: application/json
```

 Fetches a single post with ID 1. The `Accept` header tells the server we want JSON response.

### GET with Variables
```http
GET {{BASE_URL}}/posts/1
Authorization: Bearer {{TOKEN}}
Accept: application/json
```

 Uses environment variables for the base URL and authentication token. Variables are defined in your environment file.

---

## POST Requests

Create new resources on the server.

### POST with JSON Body
```http
POST https://jsonplaceholder.typicode.com/posts
Content-Type: application/json

{
  "title": "API Lab",
  "body": "Testing POST request",
  "userId": 1
}
```

 Creates a new post. The `Content-Type: application/json` header tells the server we're sending JSON data. Note the blank line between headers and body.

### POST with Query Parameters
```http
POST https://api.example.com/search?limit=10&sort=desc
Content-Type: application/json

{
  "query": "api testing"
}
```

 Combines query parameters in the URL with a JSON body. Useful for filtering or pagination alongside data submission.

### POST with Custom Headers
```http
POST https://api.example.com/data
Content-Type: application/json
X-Client-Id: api-lab
X-Request-Source: vscode

{
  "value": 42
}
```

 Adds custom headers for client identification or tracking. Many APIs require specific headers for authentication or analytics.

### POST with No Body
```http
POST https://api.example.com/trigger
Authorization: Bearer {{TOKEN}}
```

 Some POST endpoints don't require a body (like triggering webhooks or actions). Just include the headers.

---

## PUT Requests

Replace an entire resource.

### Full Resource Update
```http
PUT https://jsonplaceholder.typicode.com/posts/1
Content-Type: application/json

{
  "id": 1,
  "title": "Updated Title",
  "body": "Updated content",
  "userId": 1
}
```

 Replaces the entire post with ID 1. PUT typically requires all fields, even if only one is changing.

---

## PATCH Requests

Partially update a resource.

### Partial Resource Update
```http
PATCH https://jsonplaceholder.typicode.com/posts/1
Content-Type: application/json

{
  "title": "Partially Updated Title"
}
```

 Updates only the `title` field. PATCH is more efficient when you only need to change specific fields.

---

## DELETE Requests

Remove resources from the server.

### Delete with Authentication
```http
DELETE https://jsonplaceholder.typicode.com/posts/1
Authorization: Bearer {{TOKEN}}
```

 Deletes the post with ID 1. Most DELETE endpoints require authentication to prevent unauthorized deletions.

---

## HEAD Requests

Retrieve headers without the response body.

### Check Resource Metadata
```http
HEAD https://jsonplaceholder.typicode.com/posts/1
```

 Returns only the headers (like `Content-Type`, `Content-Length`) without the actual data. Useful for checking if a resource exists or getting metadata.

---

## OPTIONS Requests

Discover what HTTP methods are supported.

### Check Available Methods
```http
OPTIONS https://jsonplaceholder.typicode.com/posts
```

 Returns the allowed HTTP methods (GET, POST, etc.) for the endpoint. Useful for API discovery and CORS preflight requests.

---

## Multiple Requests

Execute multiple requests in sequence from a single file.

### Chained Requests
```http
# Get all posts
GET https://httpbin.org/get

###

# Create a new post
POST https://httpbin.org/post
Content-Type: application/json

{
  "tool": "API Lab"
}

###

# Delete a post
DELETE https://httpbin.org/delete
Authorization: Bearer {{TOKEN}}
```

 Use `###` as a separator between requests. Only the request where your cursor is positioned will execute when you run it.

---

## 2. Run the request

1. Click inside the `.http` file
2. Press **Ctrl + Shift + P**
3. Run:

```
API Lab: Send HTTP Request
```

---

## 3. View the response

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

---
## Important Notes

### Headers and Body Separation
- **Always include a blank line between headers and the request body**
- Missing this line will cause the body to be interpreted as headers

### Content-Type Header
- Use `Content-Type: application/json` for JSON payloads
- Use `Content-Type: application/x-www-form-urlencoded` for form data
- Use `Content-Type: multipart/form-data` for file uploads

### Environment Variables
- Define variables in your environment file: `BASE_URL`, `TOKEN`, etc.
- Reference them in requests using `{{VARIABLE_NAME}}`
- Keeps sensitive data like tokens out of your request files

### Request Execution
- Only the request under your cursor executes
- Use keyboard shortcuts or the "Send Request" button
- Responses appear in a separate panel

### Common Headers
- `Authorization: Bearer {{TOKEN}}` - JWT authentication
- `Accept: application/json` - Expected response format
- `User-Agent: API-Lab/1.0` - Client identification
- `X-API-Key: {{API_KEY}}` - API key authentication

