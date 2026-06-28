# testing-strategy

## Purpose
Define test strategy for critical flows.

## Responsibilities
- Unit and integration coverage
- Auth and tenant isolation tests
- Contract tests

## Workflows
1) Identify critical flows.
2) Map tests to layers.
3) Define test data strategy.

## Review Checklist
- Unit tests for biz logic
- Integration tests for data
- Contract tests for APIs

## Implementation Standards
- Deterministic tests
- Seeded test data

## Anti-Patterns
- No tests for auth/RBAC
- Manual testing only

## Production Rules
- Coverage for critical flows
