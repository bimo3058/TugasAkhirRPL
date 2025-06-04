# Authentication API Documentation

## Overview

This documentation provides details about the authentication endpoints available in the JagaDompet API. The authentication system uses JWT (JSON Web Tokens) for secure user authentication.

## Base URL

```
http://localhost:5000/api/auth
```

## Endpoints

### Register User

Register a new user account.

**Endpoint:** `POST /signup`

**Request Body:**

```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

**Response (201 Created):**

```json
{
  "message": "User registered successfully",
  "user": {
    "id": "number",
    "name": "string",
    "email": "string"
  }
}
```

**Error Responses:**

- `400 Bad Request` - User already exists

```json
{
  "message": "User already exists"
}
```

- `500 Internal Server Error` - Server error

```json
{
  "message": "error message"
}
```

### Login User

Authenticate user and get access token.

**Endpoint:** `POST /login`

**Request Body:**

```json
{
  "email": "string",
  "password": "string"
}
```

**Response (200 OK):**

```json
{
  "message": "Login successful",
  "token": "string",
  "user": {
    "id": "number",
    "name": "string",
    "email": "string"
  }
}
```

**Error Responses:**

- `400 Bad Request` - Invalid credentials

```json
{
  "message": "Invalid credentials"
}
```

- `500 Internal Server Error` - Server error

```json
{
  "message": "error message"
}
```

### Get User Profile

Get authenticated user's profile information.

**Endpoint:** `GET /profile`

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200 OK):**

```json
{
  "user": {
    "user_id": "number",
    "name": "string",
    "email": "string",
    "created_at": "date",
    "updated_at": "date"
  }
}
```

**Error Responses:**

- `401 Unauthorized` - No token provided

```json
{
  "message": "No token, authorization denied"
}
```

- `401 Unauthorized` - Invalid token

```json
{
  "message": "Token is not valid"
}
```

- `401 Unauthorized` - User not found

```json
{
  "message": "User not found"
}
```

## Authentication Flow

1. **Registration:**

   - Frontend sends user details to `/signup`
   - Backend validates, hashes password, and creates user
   - Returns user data (without password)

2. **Login:**

   - Frontend sends credentials to `/login`
   - Backend validates and returns JWT token
   - Frontend stores token (e.g., in localStorage)

3. **Protected Routes:**
   - Frontend includes token in `Authorization` header
   - Format: `Bearer <token>`
   - Token is permanent (does not expire)

## Example Frontend Implementation

```javascript
// Registration
const register = async (userData) => {
  try {
    const response = await fetch("http://localhost:5000/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

// Login
const login = async (credentials) => {
  try {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
    }
    return data;
  } catch (error) {
    throw error;
  }
};

// Get Profile
const getProfile = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:5000/api/auth/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};
```

## Error Handling

1. **Network Errors:**

   - Handle failed requests
   - Implement retry logic if needed
   - Show appropriate error messages to users

2. **Authentication Errors:**

   - Clear token on 401 responses
   - Redirect to login page
   - Show appropriate error messages

3. **Validation Errors:**
   - Display specific error messages
   - Highlight invalid fields
   - Provide guidance for correction

## Security Considerations

1. **Token Storage:**

   - Store JWT in localStorage or secure cookie
   - Clear token on logout
   - Consider implementing token revocation for security

2. **Password Handling:**

   - Never store plain text passwords
   - Implement password strength requirements
   - Add password confirmation on registration

3. **CORS:**
   - Backend is configured to accept requests from frontend
   - Update CORS settings for production

## Development Notes

- The API uses JWT for authentication
- Tokens are permanent (never expires)
- Passwords are hashed using bcrypt
- User IDs are auto-incrementing
- All dates are stored in UTC format