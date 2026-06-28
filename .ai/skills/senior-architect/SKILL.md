# senior-architect

## Purpose
Provide system-wide architectural guidance with production readiness focus.

## Responsibilities
- Define target architecture and boundaries.
- Identify systemic risks and coupling.
- Enforce multi-tenant safety and compliance.

## Workflows
1) Map system boundaries and dependencies.
2) Identify high-risk interfaces and data flows.
3) Propose refactors with minimal disruption.

## Review Checklist
- Clear layer boundaries and interfaces
- Single source of truth for auth and config
- Consistent deployment pipeline

## Implementation Standards
- Explicit interfaces and contracts
- Fail-fast config validation
- Observability baked in

## Anti-Patterns
- Client-provided tenant_id trusted server-side
- Hidden global state or side effects
- Unversioned API contracts

## Production Rules
- No secret defaults
- Mandatory RBAC
- Automated migrations
