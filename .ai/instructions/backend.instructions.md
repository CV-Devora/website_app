# Backend Instructions

- Enforce Kratos layering: transport -> service -> biz -> data.
- Use dependency injection via wire for all service registration.
- Validate all inputs in service layer; reject invalid payloads.
- Enforce tenant isolation using JWT context, not client input.
- Require RBAC checks for admin and tenant routes.
- Use typed errors and consistent API envelopes.
- Add pagination and filtering to list endpoints.
- Apply context timeouts to all database queries.
