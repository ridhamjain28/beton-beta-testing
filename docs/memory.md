# Beton Website Memory

## Project Overview
Beton is a premium architectural lighting brand based in Surat, Gujarat. The website serves as a catalogue and enquiry platform (non-ecommerce) for architects, designers, builders, and homeowners to discover and request quotes for lighting solutions. It is designed to be mobile-first and high-performing.

## Business Purpose
To generate business enquiries, showcase the product catalogue clearly, and build brand credibility as an architectural lighting brand with in-house manufacturing capabilities. 

## Tech Stack
- **Frontend Framework**: Pure HTML5 / Vanilla JS
- **Styling**: Tailwind CSS (v3.4.1) via CLI build
- **Icons**: Iconify
- **Backend / Database**: None (Static site)
- **Forms**: Web3Forms (for contact/enquiry integration)

## Repository Structure
- `/src`: Contains all HTML files, CSS files (`input.css`, `styles.css`), and the `assets/` folder with images.
- `/src/assets/images`: Contains photography for applications, products, and temporary renders.
- `BETON.md`: Copywriting and brand ethos.
- `design.md`: Comprehensive design system, typography, color palette, component guidelines, and mobile-first approach instructions.
- `tailwind.config.js`: Tailwind configuration.
- `package.json`: Contains the build script (`npx tailwindcss -i ./src/input.css -o ./src/styles.css --minify`).

## System Architecture
The project is a static multi-page application (MPA) relying on standard browser navigation.
There is no backend or database. Enquiries are handled via an external form submission provider (Web3Forms).

## Routing Map
See `routes.md` for a complete breakdown. The routing is based on standard HTML file paths.
- `/` -> `index.html` (Home)
- `/about.html` -> About Us
- `/products.html` -> Product Catalogue
- `/product-details.html` -> Specific Product Details
- `/applications.html` -> Use Cases
- `/projects.html` -> Portfolio
- `/resources.html` -> Lighting Guide / Resources
- `/contact.html` -> Enquiry & Contact
- `/manufacturing.html` -> Manufacturing Process

## Frontend Architecture
Pure HTML pages. The layout uses Tailwind utility classes for responsive design. The CSS architecture relies heavily on Tailwind with custom utilities defined in `input.css`. 
State management is minimal, relying purely on Vanilla JS for mobile menu toggles and interactive elements (like the enquiry sticky footer).

## Backend / Database Architecture
N/A - This is a static site. 

## Authentication Flow
N/A - No user authentication.

## API Inventory
- **Web3Forms**: External API used for processing form submissions from the Contact / Enquiry page.

## Data Flow Diagrams
User Action (Click "Submit Enquiry") ↓ Web3Forms API ↓ Email Notification to `info@betonlighting.com` ↓ User sees success message.

## Environment Variables
None are currently stored in the repository.

## Third Party Integrations
- Web3Forms (Form handling)
- Iconify (Icons)
- Google Fonts (Montserrat)

## Feature Inventory
- **Mobile-first Navigation**: Responsive hamburger menu.
- **Product Catalogue**: Display lighting products.
- **Enquiry System**: Add products to enquiry, submit contact forms.
- **Sticky Enquiry Footer**: Persistent mobile CTA for easy access to contact options.
- **Application Showcase**: Sections for Residential, Commercial, Hospitality, Retail, Office, and Healthcare.

## Dependency Graph
Very flat dependency structure. 
`*.html` files -> `styles.css` -> `input.css` (via Tailwind build).
Images loaded from `assets/`.

## Important Files
- `src/index.html`: Main landing page.
- `design.md`: The single source of truth for design choices, typography, colours, and component structures.
- `AGENTS.md` & `BETON.md`: The source of truth for business rules, constraints, and copy.

## Performance Notes
- The site relies heavily on images. Optimization via AVIF/WebP and lazy loading is critical (as outlined in `design.md`).
- Tailwind CSS is minified via the build script for minimal payload.

## Technical Debt
- Lack of componentization: As an HTML-only MPA, elements like the header, footer, and mobile menu are duplicated across all HTML files. This could become difficult to maintain as the site grows.

## Development Workflow
- Run `npm run build` to compile Tailwind CSS from `input.css` to `styles.css`.
- Open HTML files directly in the browser or use a simple local server (like Live Server).

## Deployment Process
- Likely deployed to Vercel (given the presence of `vercel.json`) or a similar static host.

## Known Risks
- HTML duplication leading to inconsistencies across pages.

## Future Recommendations
- If the catalogue grows significantly, consider a lightweight templating engine (like 11ty, Astro, or Alpine.js) to DRY up headers/footers and handle product data dynamically from JSON files instead of hardcoding HTML.
