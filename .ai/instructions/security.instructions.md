# Security Instructions

- No hardcoded secrets or fallback JWT secrets.
- Never trust tenant_id from the client.
- RBAC is mandatory for all protected routes.
- Validate all input and sanitize error outputs.
- Enforce CORS allowlists and rate limits on auth.
