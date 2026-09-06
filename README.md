# Saral Pooja — Website

A static, multi-page marketing website for Saral Pooja, built from the provided
content brief and the Privacy Policy, Terms & Conditions, Refund & Cancellation
Policy, and Account Deletion Policy.

No build step, no framework, no dependencies — just HTML, CSS and a small
amount of vanilla JavaScript, so it runs anywhere instantly.

## Pages included

| Page | File |
|---|---|
| Home | `index.html` |
| About Us | `about.html` |
| Services | `services.html` |
| How It Works | `how-it-works.html` |
| Contact Us | `contact.html` |
| Download App | `download.html` |
| Privacy Policy | `privacy-policy.html` |
| Terms & Conditions | `terms.html` |
| Refund & Cancellation Policy | `refund-policy.html` |
| Account Deletion Policy | `account-deletion.html` |

Shared assets: `style.css`, `script.js`.

## Setting up the contact form (EmailJS)

The contact form on `contact.html` sends through
[EmailJS](https://www.emailjs.com). Autoreply to the person who filled out the
form is configured entirely on the EmailJS dashboard (as an auto-reply setting
on your template) — the website only needs to trigger the send, so this is a
one-time setup.

1. **Create an EmailJS account**, then set up:
   - An **Email Service** (connects EmailJS to your inbox, e.g. Gmail) → gives
     you a **Service ID**.
   - An **Email Template** with fields matching the form: `name`, `email`,
     `phone`, `topic`, `message` → gives you a **Template ID**. Turn on
     auto-reply on this template (in the template's settings) if you want the
     person who submitted the form to get an automatic confirmation email.
   - Your **Public Key**, under Account → General.

2. **Add your real credentials to `.env`** (copy `.env.example` to `.env` if
   you haven't already):
   ```
   EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxxxx
   EMAILJS_SERVICE_ID=service_xxxxxxx
   EMAILJS_TEMPLATE_ID=template_xxxxxxx
   ```

3. **Generate `config.js` from `.env`** (requires Node.js — no other
   dependencies):
   ```bash
   node scripts/generate-config.js
   ```
   This writes `config.js`, which is the file the browser actually loads
   (a plain static site has no build step to read `.env` directly at
   runtime, so this script bridges the two). Re-run it any time you change
   `.env`.

4. Reload `contact.html` in your browser and submit the form to test it.
   Until real credentials are in place, the form will show a clear
   "not configured yet" message instead of pretending to send — it won't
   fail silently.

`.env` is listed in `.gitignore` so your real credentials aren't committed if
you put this project under version control; `.env.example` is the safe,
placeholder-only version to keep in the repo.

## Run it locally

**Option A — just open it (fastest)**
Double-click `index.html`, or drag it into your browser. Every internal link
uses a relative path, so the whole site works this way with zero setup.

**Option B — a tiny local server (recommended, avoids any browser file:// quirks)**

If you have Python installed:
```bash
cd saral-pooja
python3 -m http.server 8000
```
Then open **http://localhost:8000** in your browser.

If you have Node.js installed:
```bash
cd saral-pooja
npx serve .
```
It will print a local URL (usually **http://localhost:3000**) to open.

If you use VS Code, the **Live Server** extension also works — right-click
`index.html` → "Open with Live Server."

## What to fill in before going live

The brief explicitly asked for placeholders instead of invented facts. Two
are left in the site for you to complete:

- **Google Play link** — currently `[ADD GOOGLE PLAY LINK]` on `download.html`
  and the button href on the homepage app section.
- **Service pricing** — no prices are shown anywhere on the site, since none
  were supplied. Add pricing to the service cards in `services.html` /
  `index.html` once you have real figures.

The contact form on `contact.html` is a front-end placeholder (it shows a
confirmation message but doesn't send anywhere yet) — wire `script.js` up to
your email service, form backend, or CRM when you're ready.

## Notes on the content

- All service, booking, and policy copy is grounded in the brief and the four
  policy documents you provided — nothing about pricing, ratings, user counts,
  years of experience, or partnerships has been invented.
- The four legal pages (Privacy Policy, Terms & Conditions, Refund Policy,
  Account Deletion Policy) reproduce your policies in full, with a
  page-specific table of contents for easy navigation. Two short passages in
  the Terms (Acceptable Use, and Limitation of Liability / Indemnification)
  were re-ordered slightly from the source PDF's text extraction, which had
  jumbled a couple of bullet lists out of sequence — the legal substance is
  unchanged, only the paragraph order was corrected for readability.
