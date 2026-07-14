# Architecture Map

## Overview
The Beton website is a purely static Multi-Page Application (MPA). There is no complex backend architecture, microservices, or database tier involved in this project. 

## Frontend
- **HTML5** structural pages (e.g., `index.html`, `products.html`, `contact.html`).
- **CSS** generated via **Tailwind CSS CLI**.
- Minimal **Vanilla JavaScript** used for interactivity (mobile menu, modals, basic form validation).

## Backend
- **None**. The site is a static collection of files. 

## Database
- **None**. Product data and project data are currently hardcoded into the HTML templates as per the constraints of a purely static architecture.

## External Services & APIs
- **Web3Forms**: Used to handle POST requests from the HTML contact forms, routing enquiries directly to the `info@betonlighting.com` inbox without the need for a custom backend.
- **Iconify**: Used for rendering vector icons on the frontend.
- **Google Fonts**: Used for delivering the 'Montserrat' typeface.

## Deployment
- Hosted statically. A `vercel.json` file is present in the repository, indicating deployment via **Vercel** CDN.

## Architecture Diagram

```
Browser (User)
  ↓
Frontend (Static HTML/CSS/JS deployed on Vercel)
  ↓
[If submitting enquiry form]
  ↓
External API (Web3Forms)
  ↓
Email Delivery (info@betonlighting.com)
```
