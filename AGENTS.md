<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project Rules

Project-wide rules, instructions, and templates are defined in `.ai/`:

- `.ai/AGENTS.md` — Routing logic and engineering standards
- `.ai/instructions/` — Domain-specific instructions (frontend, backend, security, etc.)
- `.ai/orchestration/` — Workflow and review flows
- `.ai/skills/` — Skill definitions for various domains
- `.ai/templates/` — Review and production readiness templates

## Key Frontend Rules

- App Router conventions; avoid client components unless necessary
- shadcn/ui defaults; avoid heavy custom styling and non-standard variants
- Feature-based structure: `components/` for shared UI, `features/` for domain code
- Provide loading, error, and empty states for all data views
- Ensure accessibility: aria labels, focus states, keyboard navigation
- Use typed API responses and consistent client abstractions
- Responsive layouts with sidebar-aware paddings
- Dynamic imports for heavy editors (Handsontable)
