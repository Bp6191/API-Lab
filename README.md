# API Lab

**Send HTTP requests directly from VS Code — no extra apps, no context switching.**

API Lab lets you write and execute HTTP requests in plain `.http` files, with responses displayed instantly in a dedicated side panel. Built for developers who want a lightweight, distraction-free alternative to Postman or Insomnia without leaving their editor.

---

## Features

- **Zero setup** — open a `.http` file, write a request, and send it
- **Full HTTP method support** — GET, POST, PUT, DELETE, PATCH, and more
- **Environment variables** — define reusable values for URLs, tokens, and keys in `api-lab.env.json`
- **Rich response panel** — view status code, headers, formatted body, and response time
- **Authentication support** — Bearer tokens, Basic Auth, API keys, and any custom header
- **Clear error reporting** — distinguishes between HTTP errors, network failures, and malformed requests

---

## Requirements

- Visual Studio Code `^1.107.0`

No additional runtime dependencies. Install and go.

---

## Quick Start

**1.** Create a file with a `.http` extension (e.g., `requests.http`)

**2.** Write a request:

```http
GET https://httpbin.org/get
Accept: application/json
```

**3.** Open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`) and run:

```
API Lab: Send HTTP Request
```

**4.** The response opens in a side panel.

---

## Organizing Your Request Files

`.http` files are just plain text — they live in your project like any other file. A common approach is to keep them in a dedicated folder:

```
my-project/
├── src/
├── requests/
│   ├── users.http
│   ├── posts.http
│   └── auth.http
├── api-lab.env.json
└── package.json
```

These files double as **API documentation** — new team members can open them and immediately see every endpoint, what headers are needed, and what the payloads look like.

**Want to commit them?** Go ahead — they're useful for the whole team.

**Want to keep them local?** Add this to your `.gitignore`:

```
*.http
api-lab.env.json
```

---

## Request Format

Requests follow a simple, standard structure:

```
METHOD URL
Header: Value
Header: Value

Request body (optional)
```

A blank line separates headers from the body. That is the only formatting requirement.

---

## Examples

### GET

```http
GET https://jsonplaceholder.typicode.com/posts/1
Accept: application/json
```

### POST

```http
POST https://jsonplaceholder.typicode.com/posts
Content-Type: application/json
Accept: application/json

{
  "title": "Hello World",
  "body": "This is a new post.",
  "userId": 1
}
```

### PUT

```http
PUT https://jsonplaceholder.typicode.com/posts/1
Content-Type: application/json
Accept: application/json

{
  "id": 1,
  "title": "Updated Title",
  "body": "Updated content.",
  "userId": 1
}
```

### DELETE

```http
DELETE https://jsonplaceholder.typicode.com/posts/1
Accept: application/json
```

---

## Environment Variables

Store shared values — base URLs, tokens, API keys — in an `api-lab.env.json` file at your workspace root:

```json
{
  "BASE_URL": "https://jsonplaceholder.typicode.com",
  "TOKEN": "your-token-here",
  "API_KEY": "your-api-key-here"
}
```

Reference them in any `.http` file using `{{VARIABLE_NAME}}` syntax:

```http
GET {{BASE_URL}}/posts/1
Authorization: Bearer {{TOKEN}}
Accept: application/json
```

API Lab resolves variables at send time. This makes it straightforward to switch between environments (development, staging, production) by updating a single file.

> **Note:** Add `api-lab.env.json` to `.gitignore` to keep secrets out of version control.

---

## Authentication

Set authentication via request headers. Common patterns:

```http
# Bearer token
Authorization: Bearer {{TOKEN}}

# Basic Auth (Base64-encoded credentials)
Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=

# API Key
X-API-Key: {{API_KEY}}
```

All header-based authentication schemes are supported.

---

## Response Panel

After a request is sent, the response panel displays:

| Field | Description |
|-------|-------------|
| **Status** | HTTP status code and reason phrase (e.g., `200 OK`, `404 Not Found`) |
| **Headers** | All response headers returned by the server |
| **Body** | Response payload — JSON is automatically pretty-printed |
| **Time** | Total round-trip duration in milliseconds |

---

## Error Handling

API Lab surfaces three distinct error categories:

| Error | Cause |
|-------|-------|
| **HTTP Error** | Server responded with a non-2xx status code |
| **Network Failure** | Request was sent but no response was received (server unreachable, no connectivity) |
| **Invalid Request** | Malformed `.http` file — missing URL, bad syntax, or unsupported format |

---

## Contributing

Bug reports and feature requests are welcome via [GitHub Issues](https://github.com/bharathipandurangan/api-lab/issues).

---

## License

[MIT](LICENSE)
