# Frontend Instructions

- Use Next.js App Router patterns and avoid unnecessary client components.
- Prefer shadcn/ui defaults; do not introduce custom visual systems.
- Enforce feature-based structure with shared UI in components/ and domain code in features/.
- Use typed API responses and a single client abstraction.
- Provide loading, error, and empty states for all data pages.
- Handsontable must be dynamically imported with ssr: false.
- Ensure accessibility: aria labels, focus states, keyboard navigation.
- Avoid overly heavy styling, font-black, or tracking-wide.
- Use responsive layouts with sidebar-aware paddings.
