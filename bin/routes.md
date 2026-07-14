# Routes Map

Because this is a static HTML site, "routing" maps directly to physical HTML files in the `/src` directory.

| Route / File Path | Purpose | Auth Required |
| --- | --- | --- |
| `/` or `index.html` | Home page and landing page for Beton. | No |
| `about.html` | Brand story, mission, vision, and manufacturing expertise. | No |
| `products.html` | Product catalogue discovery page. | No |
| `product-details.html` | Template/example of a specific product detail page. | No |
| `applications.html` | Showcases products sorted by architectural spaces (Residential, Commercial, etc.). | No |
| `projects.html` | Portfolio of completed architectural projects. | No |
| `resources.html` | Lighting guides and educational materials for buyers and architects. | No |
| `contact.html` | Contact details and enquiry form. | No |
| `manufacturing.html` | Detailed breakdown of the manufacturing process (often linked from About). | No |
| `professionals.html` | Specific landing page or resources geared toward B2B professionals. | No |
| `interaction.html` | Sandbox/Test page for UI interactions or specific components. | No |

*Note: All routing is handled directly by the browser requesting the HTML files. There are no dynamic routes (e.g., `/products/[id]`) native to this setup.*
