# Security Checklist – Warranty Management System

## 1. Purpose

This checklist records the security measures reviewed for the warranty management system during the development and deployment process.

## 2. Security Checklist

| ID | Security Item | Status | Evidence |
|---|---|---|---|
| SC-01 | Sensitive configuration is separated from application source code using environment variables. | PASS | `.env.example` documents `SECRET_KEY`, `DEMO_USERNAME`, and `DEMO_PASSWORD`. |
| SC-02 | The actual environment file is excluded from Docker build context. | PASS | `.dockerignore` excludes `.env`. |
| SC-03 | API authentication uses signed tokens. | PASS | `src/auth.py` uses `URLSafeTimedSerializer` to issue and validate tokens. |
| SC-04 | Authentication tokens have an expiration time. | PASS | Tokens are configured with a maximum age of 8 hours. |
| SC-05 | Invalid or expired tokens are rejected. | PASS | `validate_token()` handles invalid signatures and expired tokens. |
| SC-06 | Credential comparison uses a timing-safe comparison method. | PASS | `authenticate()` uses `hmac.compare_digest()`. |
| SC-07 | Sensitive files are not committed to the repository. | PASS | The project configuration uses `.env.example` for sample values and keeps `.env` outside the Docker build context. |

## 3. Review Result

Seven security items were reviewed based on the current project implementation.

The project separates sample configuration from application configuration, uses signed tokens with an expiration period, and rejects invalid authentication tokens. The actual `.env` file is excluded from the Docker build context.

This checklist represents the security measures currently implemented in the project and does not claim that the system has completed a full security audit.