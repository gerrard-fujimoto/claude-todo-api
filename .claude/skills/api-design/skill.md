---
name: rest-api-design
description: RESTful API design standards including endpoint naming, status codes, and error responses. Use when designing new API endpoints, defining error responses, reviewing API structure, or implementing HTTP methods. Trigger keywords: API design, REST API, RESTful, endpoint, status code, error response, HTTP method, API仕様, エンドポイント設計, API設計
---

# REST API Design Standards

## Endpoint Naming
- Use plural nouns for resources: `/users`, `/posts`
- Use kebab-case: `/user-profiles`
- Avoid verbs in URLs

## HTTP Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error

## Response Format
```json
{
  "data": {},
  "error": null,
  "meta": {
    "timestamp": "2025-10-29T00:00:00Z"
  }
}
