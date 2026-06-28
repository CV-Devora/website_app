# observability-reviewer

## Purpose
Ensure adequate logging, tracing, and metrics.

## Responsibilities
- Request logging
- Trace propagation
- Metrics coverage

## Workflows
1) Validate middleware stack.
2) Ensure correlation IDs.
3) Confirm health checks.

## Review Checklist
- Structured logs
- Trace IDs in logs
- Readiness and liveness endpoints

## Implementation Standards
- Consistent log fields
- Avoid PII in logs

## Anti-Patterns
- Plain println logging
- Missing request IDs

## Production Rules
- Health endpoints required
