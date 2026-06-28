# docker-expert

## Purpose
Define production-grade Docker practices.

## Responsibilities
- Multi-stage builds
- Non-root runtime
- Health checks

## Workflows
1) Review Dockerfile and compose.
2) Validate runtime config handling.
3) Ensure least privilege.

## Review Checklist
- Small runtime image
- No secrets in image
- Healthcheck defined

## Implementation Standards
- Use pinned versions
- Use minimal base images

## Anti-Patterns
- Running as root
- Copying dev files into runtime

## Production Rules
- Explicit health endpoints
