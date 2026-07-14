# Dependency Graph

The project structure is extremely simple and flat.

## Build Dependencies
`package.json` relies solely on `tailwindcss` as a devDependency.
- `npm run build` triggers `npx tailwindcss -i ./src/input.css -o ./src/styles.css --minify`

## File Dependencies

```
/src
  ├── input.css (Tailwind Directives)
  │     └── [Build Process] 
  │           └── styles.css (Compiled CSS)
  │
  ├── index.html
  │     ├── <link href="styles.css">
  │     └── <img src="assets/...">
  │
  ├── about.html
  │     ├── <link href="styles.css">
  │     └── <img src="assets/...">
  │
  ├── (Other .html files...)
  │     ├── <link href="styles.css">
  │     └── <img src="assets/...">
  │
  └── assets/
        └── images/ (Static Image Dependencies)
```

## Critical Files
- `src/input.css`: The source styling file. All custom Tailwind configurations and `@apply` rules originate here.
- `package.json`: Contains the crucial build script.
- `design.md` & `AGENTS.md`: The guiding principles for the entire project. Modifications to UI or copy MUST respect these files.
- `src/index.html`: The primary entry point for the user experience.
