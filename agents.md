# AGENTS.md — Beton Website

## 1. Project Mission

Build and maintain a mobile-first website for Beton, a premium architectural lighting brand serving Gujarat.

The website is a catalogue and enquiry platform. It is not an e-commerce store.

Primary goals:

1. Generate enquiries.
2. Present the product catalogue clearly.
3. Build trust and brand credibility.
4. Help professionals and non-experts find suitable lighting products.

Approximately 95% of visitors are expected to use mobile devices. Mobile is therefore the primary design target, not a reduced desktop version.

---

## 2. Source of Truth

Use the following priority order:

1. `design.md`
2. Existing approved brand assets and logo files
3. Existing project structure and working styles
4. Existing content files and product assets in the working directory
5. This `AGENTS.md`

When instructions conflict, follow the higher-priority source.

Do not invent brand facts, specifications, certifications, project details, or statistics.

---

## 3. Brand Positioning

Always present Beton as:

> A premium architectural lighting brand with in-house manufacturing, assembly, testing, and quality control capability.

Do not present Beton as only a factory or commodity lighting manufacturer.

Official tagline:

> Lighting Beyond Eternity.

Tone:

- confident, not boastful;
- premium, not flashy;
- technical, not confusing;
- professional, not cold;
- precise, not verbose;
- trustworthy, not sales-focused.

---

## 4. Non-Negotiable Business Rules

- No direct online sales.
- No visible product prices.
- Never use “Buy Now”, “Checkout”, or “Cart”.
- Use “Add to Enquiry” and “Enquiry List”.
- Visitors may download product datasheets.
- Visitors may download the complete catalogue.
- Visitors may add multiple products to one enquiry.
- Product and project data must be real or clearly marked as placeholder.
- Existing assets in the working directory may be used as temporary placeholders.

---

## 5. Required Pages

Maintain or create these pages:

- Home
- About
- Products
- Product Detail
- Applications
- Projects
- Lighting Guide
- Contact / Enquiry

The Applications page must contain these six sections:

1. Residential
2. Commercial
3. Hospitality
4. Retail
5. Office
6. Healthcare

---

## 6. Mobile-First Rules

All components must be designed and tested first at:

- 360px
- 390px
- 430px

Then expand for tablet and desktop.

### Mobile requirements

- Use a hamburger menu.
- Keep the header compact.
- Make tap targets at least 44x44px.
- Primary buttons should be 48-52px high.
- Do not depend on hover.
- Avoid horizontal overflow, except intentional specification tables.
- Use responsive images and lazy loading.
- Keep page gutters at 16-20px.
- Ensure text remains readable without zooming.
- Avoid carousels in the hero.
- Avoid autoplay media.

### Product listing view

Provide a user-controlled switch between:

- one large card per row;
- two compact cards per row.

Remember the selected mode for the current session when practical.

### Mobile filters

Product filters should open in a bottom sheet or full-screen panel.

Include:

- close control;
- clear filters;
- result count;
- apply filters action.

### Sticky product CTA

Product detail pages should include a dismissible sticky bottom action for:

- Add to Enquiry;
- Request Details;
- or Enquiry List summary.

The control must include a small dismiss button and must not permanently cover content.

---

## 7. Visual Rules

### Palette

Use only:

- Deep Cobalt `#264796`
- Pure White `#FEFEFE`
- Carrot Orange `#EF7F1A`
- Sunburst Yellow `#FECC00`
- neutral text and border colors defined in `design.md`

The site is light theme only.

### Shape language

- Prefer sharp corners.
- Use minimal radius, typically 0-4px.
- Avoid excessive pills.
- Avoid soft playful cards.

### Avoid

- gradients;
- glassmorphism;
- neon colors;
- thick shadows;
- excessive motion;
- generic SaaS sections;
- stock-heavy “corporate” imagery;
- discount banners;
- e-commerce badges.

---

## 8. Typography Rules

Use Montserrat as the primary typeface.

A secondary heading typeface may be used only when:

- it improves the premium architectural feel;
- it remains readable on mobile;
- it does not increase font payload excessively;
- it is used consistently.

Do not use body text smaller than 16px on mobile.

Avoid 800-900 font weights for large sections of text.

---

## 9. Product Experience

Support both user modes:

### Expert user

- direct category access;
- search;
- technical filters;
- readable specification tables;
- datasheet access;
- quick enquiry actions.

### Guided user

- browse by application;
- clear explanations of technical terms;
- recommended product types;
- lighting guide links;
- simple decision support.

### Product cards must not show

- prices;
- discounts;
- fake ratings;
- fake stock levels;
- purchase language.

### Product detail pages should include

- product gallery;
- name and category;
- short technical summary;
- variant selectors where data exists;
- key specifications;
- detailed specifications;
- applications;
- datasheet download;
- related products;
- add to enquiry.

### Missing product data

If data is unavailable:

- hide the field;
- or mark it as “To be confirmed” in internal/admin contexts only.

Do not show blank labels to public users.

Never guess UGR, CRI, CCT, lumens, wattage, dimensions, IP rating, or warranty values.

---

## 10. Enquiry System

Use the existing Web3Forms integration in the codebase.

### Essential form fields

Required:

- name;
- phone or email;
- enquiry type;
- message.

Optional:

- company;
- city;
- project type;
- product interest;
- file attachment.

### Enquiry types

- Product quotation
- Project consultation
- Dealer enquiry
- Catalogue request
- Sample request
- Technical support

### Contact details

Phone / WhatsApp:

- +91 99099 12897
- +91 98988 45091

Email:

- info@betonlighting.com

Address:

12, Kashyap Chambers, Station Road, Bardoli - 394601, Surat, Gujarat, India

### Enquiry list behavior

- Allow multiple products.
- Allow removal.
- Allow quantity where useful.
- Allow notes about variants or project needs.
- Persist during the browsing session.
- Do not call it a cart.

---

## 11. Content Rules

### Preferred content style

- short headings;
- precise descriptions;
- real technical proof;
- accessible explanations;
- restrained claims.

### Examples

Good:

> Designed for precise beam control in hospitality and premium residential spaces.

Good:

> Available with multiple colour temperatures and beam angles, subject to model configuration.

Bad:

> The most advanced lighting solution in India.

Bad:

> Unbeatable premium quality at the best price.

### Manufacturing language

Use manufacturing as supporting proof:

> In-house assembly, testing, and quality control help Beton maintain consistent performance across its range.

Do not make the entire brand story about manufacturing.

---

## 12. Applications Page Rules

The Applications page must remain one page with six numbered sections.

For each application include:

- use-case image;
- design objective;
- recommended product types;
- relevant technical considerations;
- link to matching products.

Recommended technical considerations:

- Residential: comfort, glare control, warmth, flexibility.
- Commercial: efficiency, consistency, maintenance.
- Hospitality: atmosphere, colour quality, layered lighting.
- Retail: colour rendering, beam control, visual focus.
- Office: UGR, uniformity, productivity, efficiency.
- Healthcare: visual comfort, reliability, hygiene, task clarity.

Do not claim compliance with medical or lighting standards unless verified.

---

## 13. Projects Rules

Projects are credibility assets.

Each project should use real data where available:

- title;
- location;
- application;
- images;
- design approach;
- products used;
- outcome.

For placeholders:

- label them clearly in development;
- do not publish fake client names;
- do not present stock images as completed Beton work.

---

## 14. Lighting Guide Rules

Explain technical concepts for general users while remaining accurate.

Cover:

- lumens;
- wattage;
- CCT;
- CRI;
- UGR;
- beam angle;
- IP rating;
- cut-out size;
- driver types;
- application selection.

Each article should include:

- plain-language explanation;
- why it matters;
- common ranges or categories only when verified;
- practical example;
- related products or applications.

---

## 15. Image Rules

Use, in order of preference:

1. Real Beton product photography
2. Real Beton project photography
3. Approved 3D renders
4. Technical diagrams
5. Clearly temporary placeholders from the working directory

Optimization requirements:

- use AVIF/WebP where practical;
- provide responsive `srcset` or platform equivalent;
- lazy-load below the fold;
- set explicit width and height;
- use meaningful alt text;
- avoid oversized hero files.

---

## 16. Motion Rules

Moderate motion is allowed.

Use:

- subtle reveal animations;
- accordion transitions;
- bottom-sheet motion;
- restrained image hover zoom;
- clear button states.

Do not use:

- heavy parallax;
- looped decorative effects;
- autoplay carousels;
- long loading animations;
- motion that blocks navigation.

Respect reduced-motion settings.

---

## 17. Technical Architecture

The current project is structured and may be hosted on Wix, but code should remain portable where possible.

### Rules

- Preserve the existing project architecture unless there is a clear reason to change it.
- Reuse existing styles only when compatible with `design.md`.
- Refactor incompatible styles instead of stacking overrides indefinitely.
- Keep components modular.
- Keep product data separate from presentation.
- Avoid unnecessary Wix-specific dependencies.
- Isolate platform-specific integrations.
- Do not introduce a CMS unless required.
- Do not introduce a new state-management library for simple UI state.
- Do not introduce large animation libraries for minor effects.

### Platform portability

Where possible:

- use standard HTML, CSS, and JavaScript concepts;
- isolate Web3Forms handling;
- isolate Wix APIs;
- store content in reusable data structures;
- avoid tying product display logic to one hosting provider.

---

## 18. Performance Rules

Prioritize mobile performance.

Required:

- optimize largest contentful images;
- defer non-critical scripts;
- minimize layout shift;
- avoid excessive third-party embeds;
- keep font families limited;
- use code splitting where supported;
- do not preload large image galleries;
- avoid loading all project assets on first render.

Do not sacrifice readability or product detail for an arbitrary score, but eliminate avoidable performance waste.

---

## 19. Testing Checklist

Before completing a page, test:

### Mobile

- 360px width
- 390px width
- 430px width
- menu opening and closing
- enquiry CTA reachability
- sticky bottom CTA dismissal
- product card view switch
- filter sheet
- horizontal specification table
- file downloads
- form validation

### Tablet/Desktop

- 768px
- 1024px
- 1280px
- 1440px

### Content checks

- no prices;
- no Buy Now language;
- no invented data;
- official tagline is correct;
- contact details are correct;
- no placeholder content appears as real proof;
- image alt text exists;
- external links and downloads work.

---

## 20. Completion Criteria

A task is complete only when:

- the mobile layout is polished first;
- desktop behavior is intentional;
- code follows the existing architecture;
- the page uses the approved palette;
- the design feels premium and architectural;
- enquiry actions are clear;
- no product price is shown;
- specifications remain readable;
- performance has not regressed unnecessarily;
- content does not invent facts;
- all new components are reusable where appropriate.

---

## 21. Git Branching Rules

- **Target Branch**: All commits and pushes must go to the `preview` branch, NOT `main`, unless the user explicitly instructs otherwise.
- **Push Reminders**: Keep track of the number of pushes. After every 3 to 5 pushes, explicitly remind the user in the chat that pushes are going to the `preview` branch and not to `main`.