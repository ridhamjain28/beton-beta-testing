# API Inventory

As a static HTML project, this site does not expose any internal APIs. It only consumes third-party APIs from the frontend.

## External APIs Used

| Method | Route / Endpoint | Purpose | Used By |
| --- | --- | --- | --- |
| `POST` | `https://api.web3forms.com/submit` | Handles form submissions and emails them to the company address. | `contact.html`, Enquiry Forms |
| `GET` | `https://code.iconify.design/...` | Fetches Iconify script and icons. | All HTML Pages |
| `GET` | `https://fonts.googleapis.com/...` | Fetches Google Fonts (Montserrat). | All HTML Pages |

There are no backend controllers, models, or internal API routes.
