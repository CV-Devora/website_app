# Orchestration Workflow

Use this workflow to coordinate skills for multi-step tasks.

1) Triage: determine domain (frontend, backend, infra).
2) Select skills based on routing logic in .ai/AGENTS.md.
3) Scan code paths and confirm target files.
4) Draft plan with security and production readiness gates.
5) Execute changes or produce reviews.
6) Validate with tests or build steps.

Default sequence for reviews:
- senior-architect -> code-reviewer -> security-reviewer -> performance-reviewer -> production-readiness-review
