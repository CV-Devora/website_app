# production-readiness-review

## Purpose
Gate releases with production readiness checks.

## Responsibilities
- Security and compliance gates
- Performance and scale checks
- Operational readiness

## Workflows
1) Run security review.
2) Validate observability.
3) Check deployment and rollback readiness.

## Review Checklist
- Config validation
- Health checks
- Migration plan

## Implementation Standards
- Fail fast on missing config
- Document rollback strategy

## Anti-Patterns
- Shipping without migrations
- Missing health endpoints

## Production Rules
- No release without tests
