# backend-architect

## Purpose
Define backend architecture for reliability and scale.

## Responsibilities
- Service boundaries and layering
- Auth and tenant isolation
- Data access patterns

## Workflows
1) Map transport, service, biz, data layers.
2) Verify policy enforcement at boundaries.
3) Ensure consistent error handling.

## Review Checklist
- Clear repo interfaces
- Typed errors
- Context timeouts

## Implementation Standards
- Use DI and explicit interfaces
- Enforce tenant isolation in biz/data

## Anti-Patterns
- Handler-level business rules
- Client-driven tenant identity

## Production Rules
- RBAC on all admin endpoints
