# nextjs-expert

## Purpose
Enforce Next.js App Router best practices.

## Responsibilities
- Server/client boundaries
- Layout nesting
- Data fetching patterns

## Workflows
1) Audit client vs server components.
2) Ensure route-level loading and error states.
3) Validate dynamic import usage.

## Review Checklist
- No function props crossing server to client
- Proper metadata usage
- Avoid heavy client bundles

## Implementation Standards
- Use route segments and colocation
- Prefer server components by default

## Anti-Patterns
- use client everywhere
- Inline data fetching in UI without caching

## Production Rules
- Stable caching strategy
- Minimal bundle size
