# AI Engineering Orchestration

This file defines the active skills, routing logic, and enforcement rules for this repository.

## Active Skills
- senior-architect
- frontend-architect
- nextjs-expert
- shadcn-ui-expert
- handsontable-expert
- backend-architect
- kratos-expert
- database-reviewer
- security-reviewer
- api-design-reviewer
- docker-expert
- observability-reviewer
- performance-reviewer
- testing-strategy
- production-readiness-review
- code-reviewer

## Routing Logic
- If task mentions Next.js, React, Tailwind, shadcn/ui, or Handsontable: use frontend-architect, nextjs-expert, shadcn-ui-expert, handsontable-expert.
- If task mentions Go, Kratos, gRPC, or service layers: use backend-architect, kratos-expert.
- If task touches data access, SQL, migrations, or Postgres: use database-reviewer.
- If task touches auth, tenant isolation, secrets, or JWT: use security-reviewer.
- If task requests review or audit: use code-reviewer plus production-readiness-review.
- If task touches Docker or deployment: use docker-expert.
- If task touches logging, tracing, metrics, or SLOs: use observability-reviewer.
- If task touches performance, scale, or export: use performance-reviewer.
- If task touches tests: use testing-strategy.

## Engineering Standards
- Prefer explicit, typed interfaces and validation at boundaries.
- No hardcoded secrets. Fail fast on missing production config.
- Enforce tenant isolation server-side; never trust tenant_id from client.
- Use least privilege for data access and auth scopes.
- Maintain feature-based structure for frontend and layered architecture for backend.
- Favor reusable components and shared patterns; avoid duplication.

## Frontend Rules
- App Router conventions; avoid client components unless necessary.
- shadcn/ui defaults; avoid heavy custom styling and non-standard variants.
- Use dynamic import for Handsontable and large editors.
- Provide loading, error, and empty states for all data views.
- Ensure accessibility: aria labels, focus states, keyboard navigation.
- Use typed API responses and consistent client abstractions.

## Backend Rules
- Kratos layering: transport -> service -> biz -> data.
- Use typed errors and map to consistent API envelopes.
- Require JWT validation and RBAC on protected endpoints.
- Enforce tenant_id from JWT context in all data access.
- Use pagination and filtering for list endpoints.
- Log with correlation IDs and include request metadata.

## Security Rules
- No JWT fallback secret or dev secret in production.
- Validate all input and reject unknown fields for write endpoints.
- Apply rate limits to auth routes.
- Restrict CORS to explicit allowlists.

## Testing Rules
- Unit tests for biz logic and validation.
- Integration tests for repos and migrations.
- API contract tests for HTTP responses.
- Tenant isolation and RBAC tests are mandatory.

## Review Rules
- Prioritize correctness, security, and maintainability.
- Flag breaking changes and missing migration steps.
- Require explicit performance considerations for large data paths.

## Docker Rules
- Multi-stage builds; non-root runtime.
- Health checks and graceful shutdown.
- Environment-driven config only.

## Observability Rules
- Request logging, tracing hooks, and metrics exporters required.
- Provide health and readiness endpoints.
