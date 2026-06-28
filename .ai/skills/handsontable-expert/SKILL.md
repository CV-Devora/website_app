# handsontable-expert

## Purpose
Ensure Handsontable integration is robust and performant.

## Responsibilities
- Dynamic import and client-only setup
- Large data handling
- License configuration

## Workflows
1) Verify dynamic import and SSR disabled.
2) Validate change handling and state sync.
3) Check license key usage.

## Review Checklist
- No full dataset re-render loops
- Proper event filtering
- Clean teardown

## Implementation Standards
- Use controlled updates
- Avoid full data cloning on each render

## Anti-Patterns
- Registering all modules when not needed
- Full table re-creation on every edit

## Production Rules
- License key must be set via env
