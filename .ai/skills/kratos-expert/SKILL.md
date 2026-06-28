# kratos-expert

## Purpose
Enforce Go Kratos idioms and middleware practices.

## Responsibilities
- App bootstrap and config loading
- Transport middleware stack
- Wire-based DI

## Workflows
1) Validate middleware registration.
2) Ensure consistent error mapping.
3) Check config loading and validation.

## Review Checklist
- Recovery, logging, tracing
- Config validation
- HTTP and gRPC parity

## Implementation Standards
- Use kratos middleware where possible
- Avoid ad-hoc error handling

## Anti-Patterns
- Manual error mapping everywhere
- No observability hooks

## Production Rules
- Health endpoints mandatory
