# Project Guide & Directory Structure — Beton Website

This document provides a clear reference map of the entire workspace directory structure for the **Beton Architectural Lighting** website codebase.

---

## 📁 Root Directory Layout

| Name | Type | Description |
| :--- | :--- | :--- |
| **`src/`** | Directory | **Primary Production Workspace.** Contains all active HTML pages, stylesheets, images, scripts, favicons, and static assets served on the live website. |
| **`bin/`** | Directory | **Archive & Non-production Assets.** Stores legacy backups, test benchmarks, raw project assets, PDF price lists, 3D model files, design mockups, and utility scripts. |
| **`AGENTS.md`** | File | Custom agent rules, project mission, non-negotiable business logic, visual constraints, and git workflow instructions. |
| **`design.md`** | File | Official design system specification, color palette, typography guidelines (Montserrat + Cormorant Garamond), component standards, and UX principles. |
| **`guide.md`** | File | *(This file)* Workspace directory structure guide and subfolder directory index. |
| **`tailwind.config.js`** | File | Tailwind CSS build configuration (scans `./src/**/*.{html,js}`). |
| **`package.json`** | File | Node package manager manifest and Tailwind CSS build script (`npm run build`). |
| **`package-lock.json`** | File | Lockfile for npm package dependencies. |
| **`vercel.json`** | File | Vercel deployment configuration designating `src/` as the static output directory. |
| **`.gitignore`** | File | Git ignore patterns for temporary files and build artifacts. |
| **`.agents/`** | Directory | Internal workspace configuration and skills directory for AI assistant tooling. |

---

## 🌐 Active Website Directory (`src/`)

`src/` is the root directory deployed by Vercel. All HTML files are accessible via standard root routing (e.g. `/about.html`, `/products.html`).

```
src/
├── assets/
│   ├── images/
│   │   ├── site/         # Core production web images (logos, hero graphics, project photos)
│   │   └── temporary/    # Fallback/placeholder images for products and applications
│   └── pdf/              # Downloadable product datasheets and technical PDFs
├── favicons/             # Website favicon icons, Apple touch icons, and webmanifest
├── light-simulation-992x/# Interactive 3D light simulation studio application
├── index.html            # Beton Home page
├── about.html            # About Beton (Brand ethos & 6 Ps of Beton)
├── products.html         # Product Catalogue & Filterable listing
├── product-details.html  # Detailed product specification viewer
├── applications.html     # 6 Lighting Application areas (Residential, Commercial, etc.)
├── projects.html         # Architectural Projects & Case Studies
├── resources.html        # Lighting Guide & Technical Educational Articles
├── contact.html          # Contact & Enquiry Form (Web3Forms integrated)
├── legal.html            # Legal Disclaimer
├── privacy.html          # Privacy Policy
├── terms.html            # Terms & Conditions
├── manufacturing.html    # Manufacturing & Testing capabilities overview
├── professionals.html    # Architectural professional partner portal
├── input.css             # Source Tailwind CSS & custom component styling
├── styles.css            # Compiled minified production stylesheet (output of npm run build)
├── index-dark.html       # Experimental dark theme trial layout
├── index-font-preview.html# Font comparison preview homepage
└── robots.txt            # Search engine crawler instructions
```

---

## 📦 Archive & Unused Assets Directory (`bin/`)

Items in `bin/` are preserved for reference or development testing, but are not served on the main website.

```
bin/
├── 3d/                          # 3D Blender models and BlenderKit lighting assets
├── Beton/                       # Raw catalogue files, PDFs, price lists, and raw product photos
├── design-assets/               # Design mockups, site screenshots, and founder graphics
├── docs/                        # Internal project documentation and technical notes
├── favicons/                    # Root backup copy of favicons
├── sandbox/                     # Temporary HTML/CSS animation test files
├── scratch/                     # Developer Python scripts and utility tools
├── src-mobile-test/             # Mobile-specific layout testing workspace
├── chrome-audit-profile-*/      # Chrome performance audit profiles
├── legacy_archive/              # Pre-refactor site code archive
├── real-time-light-simulation/  # Source files for the 3D lighting simulation
├── api-map.md                   # API mapping documentation
├── architecture.md              # System architecture reference
├── database-map.md              # Database schema map
├── dependency-graph.md          # Project dependency tree
├── routes.md                    # Route mapping file
└── roo-code.txt                 # Development prompt notes
```

---

## 🛠️ Build Commands

To re-compile the CSS stylesheet after updating `src/input.css` or `tailwind.config.js`:

```bash
npm run build
```

This compiles `src/input.css` into `src/styles.css` using Tailwind CSS with minification enabled.
