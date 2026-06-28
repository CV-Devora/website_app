# Architecture Instructions

- Prefer feature-based structure for frontend and layered architecture for backend.
- Avoid circular dependencies across layers.
- Centralize cross-cutting concerns: authz, validation, logging, errors.
- Use explicit interfaces for repositories and services.
- Document invariants and domain rules in biz layer.
