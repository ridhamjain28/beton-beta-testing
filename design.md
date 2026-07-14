---
version: 1.0
name: Beton Design System
description: A mobile-first design system for Beton, a premium architectural lighting brand serving Gujarat. The system combines minimal architectural layouts, industrial precision, luxury editorial restraint, and modern commercial usability. It is built for a catalogue-and-enquiry website where 95% of traffic is expected on mobile. The experience must help expert visitors move quickly while guiding non-expert visitors toward suitable lighting products.
---

# Beton Design System

## 1. Brand Overview

Beton is a premium architectural lighting brand with in-house manufacturing capability. The website must present Beton as a trusted design-led lighting brand first, and manufacturing as supporting proof of quality, control, and reliability.

### Official tagline

**Lighting Beyond Eternity.**

### Primary website goals

1. Generate enquiries.
2. Display the product catalogue clearly.
3. Build brand credibility.
4. Help architects, interior designers, builders, contractors, dealers, businesses, and homeowners identify suitable products.

### Commercial model

- Catalogue and enquiry only.
- No visible product pricing.
- No direct online sales.
- Visitors may add products to an enquiry list.
- Visitors may download individual datasheets.
- Visitors may download the complete catalogue.

### Audience priority

1. Architects
2. Interior designers
3. Builders and developers
4. Electrical contractors
5. Dealers and distributors
6. Businesses
7. Homeowners

The design must work equally well for:

- visitors who already know the product or specification they need;
- visitors who need guidance based on application, environment, or lighting objective.

### Primary market

Gujarat, with a strong initial focus on South Gujarat.

---

## 2. Design Direction

### Core visual character

The website should combine:

- minimal architectural structure;
- industrial technical clarity;
- luxury editorial restraint;
- modern commercial usability.

### Emotional direction

The interface should feel:

- calm and premium;
- technical and precise;
- warm and approachable.

### Shape language

- Prefer sharp corners.
- Use border radius sparingly.
- Small radii may be used only where touch usability or image clipping requires it.
- Avoid pill-heavy consumer-app styling.
- Avoid soft, playful, or toy-like UI.

### Visual hierarchy

Use:

- strong composition;
- large product and architectural imagery;
- measured typography;
- strict spacing;
- restrained use of color;
- clear section transitions.

Do not rely on:

- oversized decorative headings;
- gradients;
- glassmorphism;
- excessive card shadows;
- loud animation;
- generic SaaS patterns;
- e-commerce discount language.

---

## 3. Color System

Use only the established Beton brand palette.

```yaml
colors:
  deep-cobalt: "#264796"
  pure-white: "#FEFEFE"
  carrot-orange: "#EF7F1A"
  sunburst-yellow: "#FECC00"
  ink: "#111827"
  body: "#374151"
  muted: "#6B7280"
  hairline: "#D9DEE8"
  surface-soft: "#F5F7FA"
  surface-blue-soft: "#EEF3FF"
  success: "#1F7A4D"
  error: "#B42318"
  scrim: "#000000"
```

### Usage rules

- `deep-cobalt` is the primary brand color.
- `pure-white` is the dominant page canvas.
- `carrot-orange` is used for important calls to action and selected accents.
- `sunburst-yellow` is used sparingly for small highlights, labels, or visual emphasis.
- The website remains light theme only.
- Avoid large orange or yellow page sections.
- Never use orange and yellow simultaneously as competing focal colors.
- The design should remain mostly white, cobalt, neutral text, and photography.

### Recommended distribution

- 70-80% white and soft neutral surfaces.
- 15-20% cobalt and dark text.
- 5-10% orange/yellow accents.

---

## 4. Typography

### Primary typeface

**Montserrat**

Use for:

- navigation;
- buttons;
- body text;
- captions;
- technical labels;
- product specifications.

### Optional display typeface

A second heading typeface may be introduced only if it improves the premium architectural character and remains highly readable on mobile. Suitable options include:

- Manrope;
- Sora;
- Plus Jakarta Sans;
- Inter Tight.

If no second typeface clearly improves the design, use Montserrat throughout.

### Mobile-first type scale

```yaml
typography:
  display-xl:
    fontSize: 40px
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: -0.03em
  display-lg:
    fontSize: 34px
    fontWeight: 600
    lineHeight: 1.12
    letterSpacing: -0.025em
  display-md:
    fontSize: 28px
    fontWeight: 600
    lineHeight: 1.18
    letterSpacing: -0.02em
  heading-lg:
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.22
  heading-md:
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.3
  heading-sm:
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.35
  body-lg:
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.65
  body-md:
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
  body-sm:
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
  caption:
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.4
  label:
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: 0.08em
    textTransform: uppercase
  button:
    fontSize: 15px
    fontWeight: 600
    lineHeight: 1.2
```

### Desktop scaling

On screens above 1024px:

- `display-xl`: 64-72px
- `display-lg`: 52-60px
- `display-md`: 38-44px
- section headings: 30-36px

### Typography rules

- Never use ultra-bold 800-900 weights for long headings.
- Avoid body text smaller than 16px on mobile.
- Keep line length near 45-70 characters.
- Technical labels may use uppercase sparingly.
- Product specification data must prioritize scanability over decoration.

---

## 5. Spacing and Layout

### Base spacing system

Use a 4px base scale.

```yaml
spacing:
  1: 4px
  2: 8px
  3: 12px
  4: 16px
  5: 20px
  6: 24px
  8: 32px
  10: 40px
  12: 48px
  16: 64px
  20: 80px
  24: 96px
```

### Mobile layout

- Page gutters: 16px minimum.
- Larger phones: 20px gutters.
- Major section spacing: 56-72px.
- Card gaps: 16px.
- Sticky bottom CTA height: 64-72px.

### Desktop layout

- Maximum content width: 1280-1400px.
- Standard content width: 1180-1280px.
- Editorial text width: 680-760px.
- Section spacing: 88-120px.
- Grid gutters: 24-32px.

### Grid rules

- Start with one-column mobile layouts.
- Expand progressively at tablet and desktop.
- Never design a dense desktop grid and merely collapse it.
- On mobile, preserve information priority and reading order.

---

## 6. Responsive System

```yaml
breakpoints:
  mobile-sm: 360px
  mobile: 480px
  tablet: 768px
  desktop: 1024px
  wide: 1280px
  ultra: 1440px
```

### Mobile-first behavior

Because approximately 95% of viewers are expected on mobile:

- mobile layouts are the source of truth;
- desktop is an enhancement;
- no critical interaction may depend on hover;
- all actions must be comfortably usable by touch;
- image loading must be optimized;
- large technical content must remain understandable on small screens.

### Touch targets

- Minimum touch area: 44x44px.
- Preferred primary action height: 48-52px.
- Sticky enquiry controls must not obstruct important content.

---

## 7. Navigation

### Mobile navigation

Use:

- square Beton logo;
- hamburger menu;
- visible primary action where space allows;
- simple full-height or near-full-height menu panel.

Recommended mobile header:

- logo left;
- enquiry or call icon optional;
- hamburger right.

### Desktop navigation

Recommended links:

- Home
- About
- Products
- Applications
- Projects
- Lighting Guide
- Contact / Enquire

### Navigation behavior

- Header should remain compact.
- Sticky header is acceptable if it does not consume excessive vertical space.
- Use a white background with a thin divider or subtle shadow.
- Products may open a structured mega-menu on desktop and accordion list on mobile.

---

## 8. Page Structure

## Home

Recommended mobile-first order:

1. Hero section
2. Product categories
3. Guided discovery entry
4. Featured products
5. Application categories
6. Why Beton
7. Projects
8. Technical trust signals
9. Download catalogue
10. Enquiry CTA

### Hero requirements

- Strong product or architectural image.
- One clear heading.
- Short supporting text.
- Primary CTA: **View Products**.
- Secondary CTA: **Enquire** or **Explore Applications**.
- No carousel on mobile.
- Avoid autoplay video unless heavily optimized and muted.

## About

Include:

- brand story;
- mission;
- vision;
- values;
- manufacturing capability as proof;
- quality process;
- service region;
- trust metrics when verified.

The page should position Beton as a premium lighting brand, not simply a factory.

## Products

### Product discovery modes

Support both:

1. **I know what I need**
   - direct category browsing;
   - search;
   - filters;

2. **Help me choose**
   - browse by application;
   - browse by lighting requirement;
   - guided selection prompts.

### Product layout switch

Provide a mobile-accessible switch between:

- one large card per row;
- two compact cards per row.

Remember the selected view during the session.

### Filtering

On mobile, filters should open in a dedicated bottom sheet or full-screen panel. This panel may include:

- category;
- application;
- wattage;
- CCT;
- CRI;
- beam angle;
- mounting type;
- IP rating;
- body color;
- availability of datasheet.

Use an obvious **Apply filters** action and a visible result count.

## Product Detail

Recommended order:

1. Product image gallery
2. Product name and category
3. Short technical summary
4. Primary actions
5. Variant selectors
6. Key specifications
7. Technical specification table
8. Applications
9. Downloads
10. Related products
11. Add to enquiry

### Product actions

- Add to enquiry list
- Download datasheet
- Share product
- View related products

### Sticky mobile action

Use a dismissible sticky bottom bar with:

- product count if enquiry list is used;
- Add to Enquiry / Request Details action;
- small close or dismiss control.

Do not permanently obstruct the page.

### Technical data on mobile

Use both:

- collapsible specification groups;
- horizontal scrolling tables where comparison or multi-column structure requires it.

Do not compress specification tables until they become unreadable.

## Applications

Use one page containing six numbered sections:

01 Residential  
02 Commercial  
03 Hospitality  
04 Retail  
05 Office  
06 Healthcare

Each section should include:

- architectural image;
- lighting objective;
- recommended product types;
- relevant performance considerations;
- CTA to view suitable products.

## Projects

Present completed projects as credibility and application proof.

Each project may include:

- project title;
- location;
- application type;
- project images;
- lighting approach;
- products used;
- short outcome summary.

Avoid invented project details. Use placeholders only where actual content is not yet available.

## Lighting Guide

The guide should help non-expert and semi-technical visitors understand:

- lumens;
- wattage;
- CCT;
- CRI;
- UGR;
- beam angle;
- IP rating;
- cut-out size;
- driver types;
- common application recommendations.

The writing must remain accessible while preserving technical correctness.

## Contact / Enquiry

Keep the form minimal.

Required fields:

- Name
- Phone or Email
- Enquiry type
- Message

Optional fields:

- Company
- City
- Product interest
- Project type
- Attachment

### Enquiry types

- Product quotation
- Project consultation
- Dealer enquiry
- Catalogue request
- Sample request
- Technical support

### Form handling

Use the existing Web3Forms integration already present in the codebase.

### Contact details

Phone / WhatsApp:

- +91 99099 12897
- +91 98988 45091

Email:

- info@betonlighting.com

Address:

12, Kashyap Chambers, Station Road,  
Bardoli - 394601, Surat, Gujarat, India

---

## 9. Component System

## Buttons

### Primary button

```yaml
button-primary:
  background: "{colors.deep-cobalt}"
  text: "{colors.pure-white}"
  height: 50px
  padding: 0 22px
  radius: 2px
  border: none
```

Use for:

- View Products
- Add to Enquiry
- Submit Enquiry
- Download Catalogue

### Accent button

```yaml
button-accent:
  background: "{colors.carrot-orange}"
  text: "{colors.pure-white}"
  height: 50px
  padding: 0 22px
  radius: 2px
```

Use sparingly for one key action per viewport.

### Secondary button

```yaml
button-secondary:
  background: transparent
  text: "{colors.deep-cobalt}"
  border: 1px solid "{colors.deep-cobalt}"
  height: 50px
  padding: 0 22px
  radius: 2px
```

### Text action

- No background.
- Cobalt text.
- Use arrow or download icon only where useful.

## Product cards

### Large mobile card

- Full-width image.
- Product category label.
- Product name.
- 2-4 key specs.
- Datasheet indicator where available.
- Add to enquiry action.

### Compact mobile card

- Two-column grid.
- Image-first.
- Product name.
- One or two key specs.
- Small enquiry icon or action.
- Do not overcrowd.

### Desktop card

- 3 or 4 columns depending on viewport.
- Consistent image ratio.
- No price.
- Hover may reveal secondary actions, but all actions must still be available on touch devices.

## Application cards

- Numbered 01-06.
- Architectural imagery.
- Strong title.
- Short objective statement.
- Sharp layout with minimal overlay text.

## Project cards

- Large image.
- Project name.
- Location.
- Application type.
- Optional product count or system summary.

## Trust metrics

Use only verified values.

Potential metrics:

- Years of experience
- Number of products
- Number of projects
- Cities served
- Warranty duration
- In-house testing
- Customisation capability

Never invent numbers.

## Enquiry list

- Persistent across browsing session.
- Visible count in header or sticky action.
- Allow quantity, variant notes, and removal.
- Allow one enquiry to contain multiple products.
- No checkout terminology.
- Use “Enquiry List”, not “Cart”.

## Downloads

Support:

- individual datasheet download;
- complete catalogue download;
- visible file type and size when available.

---

## 10. Imagery

Use a mixture of:

- product photography;
- architectural project photography;
- technical diagrams;
- 3D renders.

### Image rules

- Prefer authentic Beton assets.
- Use existing assets from the working directory as placeholders where required.
- Never imply placeholder projects are real Beton installations.
- Product images should use consistent background treatment.
- Avoid generic stock images of smiling people.
- Avoid decorative imagery with no lighting relevance.

### Image ratios

- Product cards: 1:1 or 4:5.
- Project cards: 4:3 or 16:10.
- Hero: 4:5 on mobile, 16:9 or wider on desktop.
- Application cards: 4:5 mobile, 3:2 desktop.

### Mobile optimization

- Use responsive image sources.
- Prefer AVIF or WebP.
- Lazy-load below-the-fold images.
- Reserve image dimensions to prevent layout shift.

---

## 11. Motion and Interaction

Use moderate motion.

### Allowed

- subtle fade or reveal on section entry;
- image zoom of 1-2% on card hover;
- accordion transitions;
- mobile bottom-sheet transitions;
- understated page transitions;
- counters only if values are verified.

### Avoid

- parallax-heavy sections;
- looping decorative animation;
- autoplay carousels;
- long easing durations;
- motion that delays navigation;
- large canvas effects.

### Motion timing

- Micro interaction: 120-180ms.
- Component transition: 180-260ms.
- Section reveal: 300-450ms maximum.

Respect reduced-motion preferences.

---

## 12. Accessibility and General Usability

The website is for general users, not only technical specialists.

Requirements:

- readable contrast;
- clear focus states;
- keyboard-accessible controls;
- visible labels;
- descriptive alt text;
- no essential information conveyed only by color;
- plain-language explanations for technical terms;
- form errors placed next to relevant fields;
- touch-friendly controls.

A formal WCAG target is not mandatory, but good accessibility practices must be followed.

---

## 13. Technical Performance

The site should remain compatible with Wix while avoiding unnecessary lock-in.

### Implementation principles

- Separate content, components, and styling.
- Avoid Wix-only logic unless necessary.
- Keep reusable component structure portable.
- Use semantic HTML where custom code is involved.
- Preserve compatibility with the existing structured codebase.
- Reuse existing styles only when they align with this design system.
- Replace incompatible legacy styles rather than forcing them into the system.

### Performance priorities

- strong mobile Core Web Vitals;
- optimized images;
- minimal third-party scripts;
- no blocking animation libraries;
- no excessive custom fonts;
- avoid loading full product media libraries on initial page load.

### Technical content

Support accurate presentation of lighting specifications such as:

- UGR;
- CRI;
- CCT;
- lumens;
- wattage;
- beam angle;
- IP rating;
- dimensions;
- cut-out size;
- driver details.

Never fabricate missing values.

---

## 14. Content Voice

### Tone

- confident, not boastful;
- premium, not extravagant;
- technical, not confusing;
- modern, not trend-driven;
- professional, not impersonal;
- inspirational, not promotional;
- trustworthy, not sales-focused;
- precise, not verbose.

### Content rules

Prefer:

- “Designed for architectural integration and long-term performance.”
- “Available in multiple wattages, beam angles, and colour temperatures.”
- “Suitable for retail, hospitality, and premium residential applications.”

Avoid:

- “Best lighting in Gujarat.”
- “Unbeatable quality.”
- “Revolutionary products.”
- “Lowest prices.”
- “Buy now.”

### Manufacturer positioning

Preferred:

> Beton is a premium architectural lighting brand supported by in-house manufacturing, assembly, testing, and quality control.

Avoid:

> Beton is only a lighting manufacturer.

---

## 15. Known Gaps and Placeholder Rules

The following information may not yet be available:

- complete product taxonomy;
- full product specifications;
- certifications;
- verified trust metrics;
- complete project case studies;
- complete product photography;
- SEO keyword strategy.

Until real information is supplied:

- use assets already available in the working directory;
- use clear placeholders;
- do not publish invented metrics;
- do not invent certifications;
- do not fabricate product performance data;
- do not imply that stock images are completed Beton projects.

---

## 16. Design Acceptance Criteria

A page is acceptable only if:

- it works cleanly at 360px width;
- primary actions remain reachable with one hand;
- no important interaction depends on hover;
- the page looks premium without excessive decoration;
- the page clearly supports enquiry generation;
- product specifications are readable;
- no prices are displayed;
- no direct-sale language appears;
- Beton is presented as a premium architectural lighting brand;
- colors remain within the brand palette;
- the site remains light theme only;
- mobile performance is treated as a first-class requirement.