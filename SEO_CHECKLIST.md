# MASTER SEO CHECKLIST — SACHIT DEVELOPER PORTFOLIO

## 1. Technical SEO Checklist

- [x] **Canonical Domain Uniformity**: Standardized canonical base URL to `https://sachin-portfoli.vercel.app/` across all meta tags, sitemaps, robots.txt, and JSON-LD schemas.
- [x] **Robots.txt Configuration**: Configured `public/robots.txt` with `Allow: /` and pointed directly to `https://sachin-portfoli.vercel.app/sitemap.xml`.
- [x] **XML Sitemap**: Created and updated `public/sitemap.xml` containing indexable routes (`/`, `/resume`, `/privacy`, `/terms`) with valid `<lastmod>` timestamps (`2026-09-19`).
- [x] **Meta Title Tags**: Formatted primary title tag as `Sachit — AI Automation & Web Developer` (< 60 chars).
- [x] **Meta Descriptions**: Wrote concise, keyword-rich meta descriptions (< 160 chars).
- [x] **OpenGraph Social Cards**: Configured `og:title`, `og:description`, `og:url`, `og:image`, and `og:type` tags.
- [x] **Twitter Cards**: Configured `twitter:card` (`summary_large_image`), `twitter:title`, `twitter:description`, and `twitter:image`.
- [x] **Favicons & Apple Touch Icons**: Linked `/favicon.png`, `/apple-touch-icon.png`, and `/manifest.json`.
- [x] **Google Search Console Verification**: Injected verification meta tokens in `index.html`.

---

## 2. On-Page & Brand SEO Checklist

- [x] **Brand Name Consistency**: Standardized preferred developer name as **Sachit** across all sections, metadata, and schemas.
- [x] **H1 Tag Alignment**: Placed explicit brand H1 (`Sachit — AI Automation & Web Developer`) in Hero section alongside animated `DepthFlipText`.
- [x] **Heading Hierarchy**: Enforced strictly sequential `H1 -> H2 -> H3` structure across Hero, About, Projects, Skills, Quotes, and Contact sections.
- [x] **Keyword Integration**: Naturally integrated target phrases ("AI Automation & Web Developer", "Python", "React", "TypeScript", "Next.js", "Claude API") into page copy without keyword stuffing.
- [x] **Noscript Crawler Fallback**: Provided full-text fallback in `<noscript>` tag for non-JS crawlers with headings, project highlights, and contact links.

---

## 3. Structured Data (Schema.org JSON-LD) Checklist

- [x] **WebSite Schema**: Defined root URL, publisher reference, and website description.
- [x] **ProfilePage Schema**: Defined mainEntity pointing to Person schema.
- [x] **Person Schema**: Detailed name ("Sachit"), jobTitle ("AI Automation & Web Developer"), image, email, social links (`sameAs`), and skills (`knowsAbout`).
- [x] **SoftwareApplication Schemas**: Added comprehensive schemas for all 9 featured projects:
  - SKY ROMs (`WebApplication`)
  - AI Chatbot & Assistant (`WebApplication`)
  - Claude Document Summarizer (`SoftwareApplication`)
  - Schedule Planner (`SoftwareApplication`)
  - Tic-Tac-Toe Minimax AI (`WebApplication`)
  - MCP Integration Tool (`SoftwareApplication`)
  - Nexus Core ERP (`WebApplication`)
  - Sentience OS (`MobileApplication`)
  - Ghost Protocol (`SoftwareApplication`)
- [x] **ItemList Schema**: Created ordered list schema linking all project applications.

---

## 4. Accessibility & Image SEO Checklist

- [x] **Image Alt Text**: Ensured descriptive alt text for images, icons, and mascot components without keyword stuffing.
- [x] **Image Dimensions**: Explicit width/height attributes on mascot and image containers to eliminate cumulative layout shift (CLS).
- [x] **Contrast Ratios**: Verified text-to-background contrast passes WCAG AA guidelines (minimum 4.5:1 ratio).
- [x] **Skip Links**: Provided accessible keyboard navigation skip links.
- [x] **Reduced Motion Support**: Honored `prefers-reduced-motion` media queries across GSAP and Framer Motion animations.

---

## 5. Search Console & Indexing Execution Steps

- [x] Step 1: Verify property `https://sachin-portfoli.vercel.app/` in Google Search Console using HTML tag method.
- [x] Step 2: Submit sitemap `https://sachin-portfoli.vercel.app/sitemap.xml`.
- [x] Step 3: Run URL Inspection on `https://sachin-portfoli.vercel.app/`.
- [x] Step 4: Click "Request Indexing" for primary URL and sub-pages (`/resume`, `/privacy`, `/terms`).
- [x] Step 5: Monitor Search Console Coverage report for indexation status and crawl error reports.
