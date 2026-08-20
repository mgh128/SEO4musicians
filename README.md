# SEO4musicians 🎵⚡

[![Live Web App](https://img.shields.io/badge/Live%20App-mh1.eu%2Ftools%2FSEO4musicians-amber?style=for-the-badge&logo=google-chrome&logoColor=white)](https://mh1.eu/tools/SEO4musicians)
[![GitHub Repository](https://img.shields.io/badge/GitHub-mgh128%2FSEO4musicians-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/mgh128/SEO4musicians/)
[![Schema.org](https://img.shields.io/badge/Schema.org-MusicGroup%20%7C%20JSON--LD-6366f1?style=for-the-badge)](https://schema.org/MusicGroup)
[![PWA Ready](https://img.shields.io/badge/PWA-Offline%20Ready-emerald?style=for-the-badge&logo=pwa&logoColor=white)](https://mh1.eu/tools/SEO4musicians)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue?style=for-the-badge&logo=apache&logoColor=white)](LICENSE)

> **Free, self-service Progressive Web App (PWA) that generates pristine [Schema.org](https://schema.org) JSON-LD Linked Data for musicians, independent bands, and record labels.**  
> Disambiguate your entity for Google Knowledge Graph panels, search event carousels, direct Bandcamp sales, and Generative Engine Optimization (GEO).

---

## 🌐 Live Application
The tool is hosted and freely accessible at:  
👉 **[https://mh1.eu/tools/SEO4musicians](https://mh1.eu/tools/SEO4musicians)**

---

## 📖 Table of Contents
1. [Why SEO & Linked Open Data Matter for Musicians](#-why-seo--linked-open-data-matter-for-musicians)
2. [Key Capabilities & Features](#-key-capabilities--features)
3. [Quick Start Workflow](#-quick-start-workflow)
4. [Video Presentations & Narrated Guides](#-video-presentations--narrated-guides)
5. [CMS Integration & Deployment](#-cms-integration--deployment)
6. [Architecture & Technology Stack](#-architecture--technology-stack)
7. [Running Locally](#-running-locally)
8. [Legal Notice, Disclaimer & Terms of Use](#-legal-notice-disclaimer--terms-of-use)

---

## 🎯 Why SEO & Linked Open Data Matter for Musicians

In the streaming age, an artist's digital footprint is scattered across Spotify, Apple Music, Bandcamp, YouTube, Instagram, Bandsintown, Songkick, Wikipedia, and their own official website. When search engines and AI assistants crawl the web without structured data, critical problems arise:

* **Entity Ambiguity & Homonyms**: Search engines struggle to distinguish between bands with similar names.
* **Missing Knowledge Graph Panels**: Without persistent `@id` URIs and `sameAs` authority links, Google cannot confidently connect an artist's website with their streaming profiles.
* **Invisible Tour Dates & Distorted Concert Times**: Gigs trapped in flat HTML or client-side widgets lack venue-specific timezone offsets (e.g. Pacific Time `-07:00` vs. British Summer Time `+01:00`), causing search engines to show concerts at the wrong hour or miss them entirely.
* **Lost Direct Sales**: Fans searching for music are directed to third-party streaming services paying fractions of a cent, rather than direct high-margin platforms like **Bandcamp** or direct venue box offices.
* **Generative Engine Optimization (GEO)**: AI models (Gemini, ChatGPT, Perplexity, Claude, Apple Intelligence) rely heavily on structured Schema.org markup to synthesize accurate factual summaries about artists.

**SEO4musicians solves this** by translating an artist's official identity, releases, tracklists, press reviews, and concert schedule into machine-readable **JSON-LD Linked Data**.

---

## ⚡ Key Capabilities & Features

* 🚀 **Zero Dummy Data by Default**: Loads with a clean slate—no fictitious placeholder values to waste time clearing.
* 🔍 **Foremost Automated Discovery**: Enter your band's website URL, Bandcamp page, or MusicBrainz URL at the top to automatically crawl meta tags, bio, promo imagery, outbound streaming links, and tour dates.
* 🧠 **MusicBrainz Open API Cross-Referencing**: Connects official MusicBrainz Artist MBIDs, release groups, and founding origins.
* 🏷️ **Schema.org Semantic Node Builders**:
  * `schema:MusicGroup` & `schema:Person`: Band identity, legal name, founding date/studio, and member lineups with instruments and individual Wikidata entities.
  * `schema:sameAs` Directory: Authoritative array linking Spotify, Apple Music, Bandcamp, YouTube, Instagram, X, TikTok, Genius, and Musixmatch.
  * `schema:MusicAlbum` & `schema:MusicRecording`: Discography catalog with ISRC codes, composer credits, lyrics links, and **automatic ISO 8601 duration calculations** (`04:12` &rarr; `PT4M12S`).
  * 🛒 **Direct Bandcamp Purchase Offers**: Embeds direct `schema:Offer` nodes on albums and tracks (seller: Bandcamp) to reduce friction and maximize fan revenue, especially on **Bandcamp Fridays**.
  * 📍 **Venue Timezone Resolver Engine**: Automatically resolves local IANA venue timezones and Daylight Saving Time (DST) offsets (`-07:00`, `+01:00`, `+09:00`, etc.) for concert listings.
  * 🎟️ **Direct Ticket Provider Detection**: Identifies and structures direct checkout links from AXS, Ticketmaster, DICE, Eventbrite, See Tickets, Eventim, Resident Advisor, Skiddle, and Venue Box Offices.
  * 📰 `schema:Review` & `schema:subjectOf`: Editorial press acclaim and star ratings (Pitchfork, NME, Rolling Stone) for Google E-E-A-T grounding.
* 🔄 **Tour Schedule Maintenance**:
  * `[🔄 Refresh Live Schedule]`: Re-fetches the latest dates from website tour subpages (`/tour`, `/live`, `/gigs`), Bandsintown, and Songkick.
  * `[🧹 Remove Past Gigs]`: Evaluates event dates against the current timestamp and purges concluded shows.
* 📦 **Dual Export Architectures**:
  * **Consolidated Monolithic Schema**: Ideal for single-page artist sites.
  * **Multi-Page Split Schema**: Formats separated JSON-LD snippets for `Home`, `/music` Discography, Individual Album Pages, and `/tour` Event Listings.
* 🛡️ **In-App SEO Quality Auditor**: Real-time 0–100% semantic health score with actionable guidance.
* 🧪 **1-Click Direct Validators**: Direct launchers for **Google Rich Results Test** and **Schema.org Validator**.

---

## 🚀 Quick Start Workflow

1. **Step 1: Scan Your Website**: Enter your official website URL or Bandcamp profile in the top discovery bar and click **"Scan Website & Auto-Populate"**.
2. **Step 2: Review & Refine**:
   * **Tab 1 (Profile)**: Review bio, origin studio, lineup, and streaming links.
   * **Tab 2 (Discography)**: Use the built-in **Bandcamp Importer** or manual controls to pull full tracklists and artwork.
   * **Tab 3 (Tour Dates)**: Review upcoming dates, verify venue timezones, and inspect detected ticket providers.
   * **Tab 4 (Press)**: Add editorial reviews and ratings.
3. **Step 3: Export in Schema Studio (Tab 6)**: Toggle Consolidated or Multi-Page mode, copy the JSON-LD script, or download the `.jsonld` file.
4. **Step 4: Validate & Embed**: Test in 1 click using Google Rich Results Test, then paste into your CMS header.

---

## 🎬 Video Presentations & Narrated Guides

The application includes two narrated video presentations accessible directly via the **"About the tool"** button in the header or in full screen:

1. **"Why use SEO4musicians?"** (`SEO4musicians-Why.mp4`): Explains entity ambiguity, Google Knowledge Graph disambiguation, venue timezone accuracy, and direct fan revenue.
2. **"How to use SEO4musicians?"** (`SEO4musicians-How.mp4`): Step-by-step walkthrough from URL auto-discovery to 1-click CMS integration.

---

## 🛠️ CMS Integration & Deployment

Paste the generated `<script type="application/ld+json">...</script>` tag into your website's `<head>` section:

* **WordPress**: Use the free **WPCode** plugin (*Code Snippets > Header & Footer > Header*) or custom schema fields in Rank Math / Yoast.
* **Squarespace**: Navigate to *Settings > Advanced > Code Injection > Header*.
* **Wix**: Go to *Settings > Custom Code > Add Code to Head (All Pages)*.
* **Shopify**: Open *Online Store > Themes > Edit Code > Layout/theme.liquid* and paste before `</head>`.
* **Webflow / Bandzoogle**: Paste into Project Settings *Custom Code > Head*.
* **Static HTML (Apache / Nginx)**: Paste directly between `<head>` and `</head>` in your `index.html`.

---

## 🏗️ Architecture & Technology Stack

* **Zero Build Step / Zero Node.js**: Built with vanilla ES6+ JavaScript, Vue.js v3 (Options API via CDN), and Tailwind CSS (via CDN).
* **Progressive Web App (PWA)**: Includes `manifest.json` and a Service Worker (`sw.js`) with cache versioning (`v1.3.0`) for offline operation.
* **100% Client-Side Execution**: Operates entirely in the user's browser—no user data is ever stored in external databases.

```
SEO4musicians/
├── index.html        # App shell, hero URL scanner, 6 tabs, modals, video player
├── app.js            # Vue 3 reactive state, auto-discovery, timezone resolver, schema builders
├── styles.css        # Dark mode styling, glassmorphism, syntax highlighting
├── sw.js             # Service Worker (v1.3.0 offline caching & video stream bypass)
├── manifest.json     # PWA Web Manifest (v1.3.0)
├── favicon.svg       # Vector app icon
├── icon-192.png      # 192x192 PWA icon
├── icon-512.png      # 512x512 PWA icon
├── SEO4musicians-Why.mp4  # "Why use the tool" narrated video presentation
└── SEO4musicians-How.mp4  # "How to use the tool" narrated video presentation
```

---

## 💻 Running Locally

Because SEO4musicians has no dependencies or build steps, you can run it using any static HTTP server:

```bash
# Clone the repository
git clone https://github.com/mgh128/SEO4musicians.git
cd SEO4musicians

# Start a local web server (Python 3)
python3 -m http.server 8080

# Or with Node npx
npx serve .
```
Then open `http://localhost:8080` in your web browser.

---

## 🛡️ Legal Notice, Disclaimer & Terms of Use

### 1. Free Self-Service Tool Provided "As Is"
SEO4musicians is provided as a **free, self-service utility on an entirely "as is" basis**, without warranty of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, search engine ranking outcomes, or non-infringement.

### 2. Non-Destructive Client-Side Operation
SEO4musicians runs 100% inside your web browser. It **never directly modifies, edits, or alters anything on your website, your web server, CMS, or external accounts** (Spotify, Bandcamp, MusicBrainz, etc.). It solely generates standard Schema.org JSON-LD code that you can review, validate, and copy.

### 3. User Responsibility & Verification
Users retain full responsibility for reviewing, validating, and testing all generated structured data using the integrated Google Rich Results Test and Schema.org Validator before placing it on their production websites.

### 4. Limitation of Liability
Under no circumstances shall the author or host ([mh1.eu](https://mh1.eu)) be held liable for any claims, damages, ranking changes, traffic alterations, or liabilities arising from the use of this tool or the code it generates.

---

## 📄 License
This project is open source and available under the [Apache License 2.0](LICENSE).
