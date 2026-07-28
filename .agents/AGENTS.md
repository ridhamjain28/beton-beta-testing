# AGENTS.md — Workspace Customizations

## 21. Git Branching Rules

- **Default Target Branch**: Push to `preview` branch by default, unless the user explicitly says to push to `main`.
- **Main branch**: The `main` branch is auto-deployed to production on Vercel. Only push here when changes are confirmed working on the preview URL.
- **Push Reminders**: After every 3 to 5 pushes, remind the user in chat which branch is being targeted.
- **Vercel previews**: Every push to any branch (including `preview`) gets a unique Vercel preview URL — use these to verify changes before merging to `main`.
