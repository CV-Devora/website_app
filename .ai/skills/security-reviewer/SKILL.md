# security-reviewer

## Purpose
Enforce security baselines for multi-tenant banking systems.

## Responsibilities
- Auth and RBAC enforcement
- Secret management
- Input validation

## Workflows
1) Identify all protected routes.
2) Verify RBAC and tenant isolation.
3) Inspect secret handling.

## Review Checklist
- No hardcoded secrets
- JWT validation and expiration
- Rate limiting on auth

## Implementation Standards
- Use env validation
- Use safe error messages

## Anti-Patterns
- Trusting client tenant_id
- Logging sensitive payloads

## Production Rules
- Deny by default
