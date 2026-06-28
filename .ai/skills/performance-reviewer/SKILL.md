# performance-reviewer

## Purpose
Identify performance bottlenecks and scale risks.

## Responsibilities
- Query efficiency
- Export strategies
- Frontend bundle size

## Workflows
1) Find unbounded queries.
2) Inspect large in-memory operations.
3) Validate caching strategy.

## Review Checklist
- Pagination
- Streamed exports
- Context timeouts

## Implementation Standards
- Use lazy loading where needed
- Batch operations when possible

## Anti-Patterns
- In-memory full exports
- Unbounded list endpoints

## Production Rules
- Explicit timeouts
