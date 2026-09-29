# Initial Security Review Report (Task 1)

This document outlines the initial security vulnerabilities identified in the Express REST API prior to implementing security enhancements.

---

## Identified Vulnerabilities

### 1. Plaintext Passwords / Weak Hashing
- **Location:** `controllers/authController.js`
- **Risk Level:** Critical
- **Description:** Storing user passwords in plain text or returning hashed passwords in responses exposes credentials to potential database leaks and unauthorized access.
- **Remediation:** Hash passwords using `bcrypt` before database insertion, and strictly exclude `password_hash` from all JSON responses.

### 2. SQL Injection Vulnerability
- **Location:** `routes/productsRoutes.js`, `controllers/usersController.js`
- **Risk Level:** High
- **Description:** Concatenating user inputs directly into SQL queries allows attackers to manipulate queries and access unauthorized data.
- **Remediation:** Use parameterized queries (`$1, $2`) for all PostgreSQL interactions.

### 3. Missing Authentication and Authorization (Broken Access Control / IDOR)
- **Location:** `routes/usersRoutes.js`, `routes/productsRoutes.js`
- **Risk Level:** High
- **Description:** Routes lacked JWT verification and role-based access checks (`admin` vs `customer`), allowing horizontal data access (IDOR).
- **Remediation:** Implement JWT `authenticate` middleware and `authorize` role checks along with owner ID validation.

### 4. Unrestricted Rate Limits & Missing Security Headers
- **Location:** `server.js`
- **Risk Level:** Medium
- **Description:** Absence of HTTP security headers and request rate limits leaves the API vulnerable to brute-force login attacks and web exploits.
- **Remediation:** Integrate `helmet` for security headers and `express-rate-limit` for request throttling.

### 5. Detailed Stack Traces in Internal Server Errors
- **Location:** Global Error Handling
- **Risk Level:** Medium
- **Description:** Displaying internal database schema details or stack traces in error responses exposes system topology to potential attackers.
- **Remediation:** Implement a centralized error handler returning clean, generic messages without internal traces.