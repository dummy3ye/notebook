# Notebook

## 1. Stack
*   **Runtime:** `Bun` (v1.3.14+)
*   **Framework:** `Next.js` (v16.2.6)
*   **Styling:** `Tailwind CSS` (v4.3.0)
*   **Parsers:** `marked` + `front-matter`.
*   **Math Engine:** `KaTeX`.

---

## 2. Layout
*   **Left:** Blank
*   **Middle:** Chaos
*   **Layout:** the table of `contents`

---

## 3. Directory Map
```text
notebook/
├── content/              # Raw .md
├── public/               # Static assets. 
├── src/
│   ├── app/
│   │   ├── blog/
│   │   │   └── [slug]/
│   │   │       └── page.tsx  # The 3-column rendering.
│   │   ├── globals.css        # Theme variables & typography.
│   │   ├── layout.tsx         # The wrapper + ThemeToggle.
│   │   └── page.tsx           # Entry point
│   └── components/            # Reusable UI bits (ThemeToggle, etc).
```
---

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
