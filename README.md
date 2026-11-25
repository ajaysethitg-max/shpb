# Shri Haridas Poshak Bhandar — website

A shop website for deity idols, poshak and puja items.
**Everything is controlled from one Google Sheet** (shop details, phone/WhatsApp number, text, photos, products, deities).
**Customers need no login.** Orders and custom-order requests open **WhatsApp** with the message already written.
There is no database and no admin password.

## 1. Set up the Google Sheet (10 minutes, one time)

1. Open `sheet-template/Shri-Haridas-Website-Sheet.xlsx` — it is already filled with your 9 deities, idols (4 materials),
   poshak (7 fabrics) and all your puja items.
2. Upload it to Google Drive → right-click → **Open with → Google Sheets**.
3. **Share → General access → Anyone with the link → Viewer.**
4. Copy the Sheet ID from the address bar: `docs.google.com/spreadsheets/d/`**`THIS-PART`**`/edit`
5. Keep the three tab names exactly: `Settings`, `Products`, `Deities`.

### Editing the sheet
| Tab | What it does |
|---|---|
| **Settings** | Change only the `value` column. A **blank** value hides that item on the website. |
| **Products** | One row per item. Add/delete rows freely. Row order = order on the website. `price` blank = "Price on Request". |
| **Deities** | The deity list (name, Hindi name, optional tagline/description/photo). |

* Several choices in one cell → separate with `|` e.g. `Peetal|Asthdhatu|Pathar|Dust Marble`
* `category` must be `idols`, `poshak` or `puja`.
* Photos: paste any image link. Google Drive links work (share the photo as *Anyone with the link*).
  Blank photo = a "Photo coming soon" picture is shown.
* Changes appear on the website within about **2 minutes**.

## 2. How the website works

This is a **static website** (built with Next.js, saved as plain files in the `out` folder).
It works on GitHub Pages and on ordinary cPanel hosting, with no server to run.

* When the site is built, a snapshot of your sheet is saved into the pages (this is what Google and WhatsApp see).
* When a visitor opens the site, the browser reads your Google Sheet again, so edits appear **on the next page load**, with no rebuild.
* Page titles, the sitemap and link previews use the snapshot, so they update at the next build
  (the GitHub workflow rebuilds every night automatically).
* An item added to the sheet after the last build still opens, because the 404 page loads it from the live sheet.

## 3. Put it online

See `DEPLOY-GUIDE.md` for step-by-step instructions.
Short version: push to GitHub, add the repository variable `GOOGLE_SHEET_ID`, turn on GitHub Pages (Source: GitHub Actions).
For cPanel, download the `website-for-cpanel` file from the finished Actions run and upload its contents to `public_html`.
On cPanel you can also put the Sheet ID in `sheet-config.json` instead of rebuilding.

## Run on your computer
```bash
npm install
cp .env.example .env.local     # then fill in GOOGLE_SHEET_ID
npm run dev                    # http://localhost:3000
npm run build                  # makes the "out" folder
```
With no `GOOGLE_SHEET_ID` the site shows a starter catalogue (all "Price on Request") so you can preview it.

## What is NOT in the sheet
Only fixed interface labels such as button names ("Add to Order", "Send Order on WhatsApp"), the menu names, and the colour theme.
Everything about the business is in the sheet.
