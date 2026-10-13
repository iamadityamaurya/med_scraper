# MedScrapper

Compare **live medicine prices** across five Indian pharmacies — **Tata 1mg, Apollo, PharmEasy, TrueMeds and NetMeds** — in a single search. Find the lowest price, check delivery to your pincode, and jump straight to the cheapest listing.

```
Your query → 5 parallel server-side relays → Parse HTML / JSON → One clean schema → Ranked results
```

## Why it exists

There is **no public API** for medicine prices. None of the five pharmacies publish one — and even if they did, a browser page couldn't call it directly because **CORS blocks cross-site requests** from web pages.

MedScrapper solves this at the backend:

1. **Server-side relays** — CORS is a browser rule, not an internet rule. Requests leave from the Express server, so each pharmacy sees an ordinary server-to-server call, carrying the same headers (User-Agent, Origin, Referer, auth tokens) that the pharmacy's own website would send.
2. **Three extraction strategies** — whatever the source offers:
   - **Hidden JSON APIs** — endpoints the sites call themselves, reverse-engineered and replayed
   - **Embedded state blobs** — `window.PRELOADED_STATE` / `window.__INITIAL_STATE__` JSON mined out of rendered pages
   - **Raw HTML parsing** — product cards pattern-matched out of the markup where nothing structured exists
3. **One schema out** — every product, from any source, is filtered into the same shape: `name, price, mrp, discount, packSize, image, url`. The frontend never has to untangle raw data.

| Pharmacy | Technique |
| --- | --- |
| Apollo 24\|7 | Private JSON API (`search.apollo247.com/v4/fullSearch` with its auth headers) |
| TrueMeds | Internal search-suggestion API (`getSearchSuggestion`, warehouse-backed) |
| Tata 1mg | HTML product grid + `PRELOADED_STATE` mining for images/metadata |
| NetMeds | `__INITIAL_STATE__` extraction |
| PharmEasy | Raw HTML parsing of the `<main>` section |

All five requests fire **in parallel** (`Promise.all`), so a full comparison takes about as long as the slowest single source.

## Features

- **Multi-pharmacy search** — one query fans out to 5 pharmacies simultaneously
- **Price comparison** — sort by relevance, discount, price, or price-per-unit; select up to 3 products to compare side by side
- **Pincode serviceability** — check delivery availability per pharmacy (auto-detect via live location + reverse geocoding)
- **Prescription OCR** — upload a prescription photo; Google Gemini extracts the medicine names
- **Saved list** — bookmark interesting deals across searches

## Tech Stack

| | Frontend (`/`) | Backend (`/med_scraper_backend`) |
| --- | --- | --- |
| Framework | React 19 + Vite 7 | Node.js + Express |
| Styling | Tailwind CSS 4 | — |
| Routing | React Router 7 | — |
| HTTP | Fetch API | Axios |
| AI | — | Google Gemini (prescription OCR) |
| Extras | — | Multer (uploads), CORS, Dotenv, Nodemon |

## Project Structure

```
├── src/                        # Frontend
│   ├── pages/
│   │   ├── LandingPage.jsx     # Marketing page (hero, how it works, under the hood)
│   │   └── SearchPage.jsx      # Search, results, compare, saved, upload
│   ├── components/
│   │   ├── PharmacyCard.jsx    # Per-pharmacy results card (config-driven)
│   │   ├── Modal.jsx           # Shared modal shell (Esc + backdrop close)
│   │   └── accents.js          # Per-pharmacy accent tokens
│   ├── App.jsx                 # Routes: / and /search
│   └── index.css               # Tailwind theme, fonts, motion tokens
├── med_scraper_backend/
│   ├── server.js               # Express app + API routes
│   ├── tool/                   # One scraper per pharmacy
│   │   ├── 1mg.js              # HTML grid + PRELOADED_STATE
│   │   ├── apollo.js           # Private JSON API
│   │   ├── pharmeasy.js        # Raw HTML parsing
│   │   ├── truemed.js          # Internal search API
│   │   └── netmed.js           # __INITIAL_STATE__ extraction
│   ├── pincode/                # Serviceability checks per pharmacy
│   └── ocr/gemini.js           # Prescription OCR
└── vercel.json                 # SPA rewrites for frontend deploys
```

## Setup & Installation

### Backend

```bash
cd med_scraper_backend
npm install
```

Create a `.env` file in `med_scraper_backend/`:

```env
PORT=3000
FRONTEND_URL=http://localhost:5173
GEMINI_API_KEY=your_gemini_api_key_here
```

Run it:

```bash
npm run dev      # development, hot reload
npm start        # production
```

### Frontend

```bash
npm install
```

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:3000
```

Run it:

```bash
npm run dev      # http://localhost:5173
npm run build    # production build to /dist
```

## API Reference

### `POST /api/message` — search all pharmacies

```json
{ "message": "paracetamol", "maxProduct": 5 }
```

Returns aggregated results from all five sources, normalized to a common schema:

```json
{
  "success": true,
  "data": {
    "oneMg":    [{ "name": "...", "price": 30, "mrp": 40, "discount": 25, "packSize": "Strip of 15 tablets", "image": "...", "url": "..." }],
    "apollo":   [{ "name": "...", "specialPrice": 28, "discountPercentage": 20, "unitSize": "...", "pricePerUnit": "1.87" }],
    "pharmEasy": [...],
    "truemed":  [...],
    "netmed":   [...]
  }
}
```

### `POST /api/pincode` — delivery serviceability

```json
{ "pincode": "110001", "lat": 28.6139, "lon": 77.2090 }
```

Returns per-pharmacy serviceability. `lat`/`lon` enable Apollo and 1mg checks.

### `POST /api/extract-medicines` — prescription OCR

`multipart/form-data` with an `image` field.

```json
{ "success": true, "data": ["Paracetamol 650mg", "Azithromycin 500mg"] }
```

### `GET /health` — health check

## Disclaimer

MedScrapper compares **publicly listed prices only** and is not affiliated with, endorsed by, or selling for any of the pharmacies shown. Purchases happen on the respective pharmacy websites.
