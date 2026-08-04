# 📖 DIAD Chatbot Integration & Deployment Guide

This document provides a step-by-step guide to integrating and deploying the **DIAD AI Chatbot Suite** into the **Diamante Collections** Next.js website.

---

## 📦 Source Package Files
The chatbot assets are located in your integration package (`C:\Users\sahai\Downloads\diad_integration_package_diamante_collections\`):
- `diad-chat-widget.js` — Floating customer support chat bubble.
- `external_chatbot.html` — Full-page customer support portal.
- `internal_chatbot.html` — Internal Executive BI & text-to-SQL advisor.
- `_redirects` — Netlify URL redirection rules file.

---

## 🚀 Step-by-Step Implementation

### Step 1: Copy Assets into the Next.js `public/` Folder
Copy the chatbot files into your project's `public/` folder so Next.js can serve them as static assets.

- **Source Path**: `C:\Users\sahai\Downloads\diad_integration_package_diamante_collections\`
- **Target Path**: `D:\Diamante Collections\website\diamante-collections\public\`

**Files to place in `public/`**:
- `public/diad-chat-widget.js`
- `public/external_chatbot.html`
- `public/internal_chatbot.html`
- `public/_redirects`

---

### Step 2: Enable Floating Support Bubble Site-Wide
Your website uses Next.js App Router. Add the script tag in `src/app/layout.tsx` so the floating bubble appears on every page.

1. Open `src/app/layout.tsx`.
2. Import `Script` from `next/script` (if not already imported) and include the tag near the end of the `<body>`:

```tsx
import Script from "next/script";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Your header, main content, etc. */}
        {children}

        {/* DIAD Chat Widget */}
        <Script
          src="/diad-chat-widget.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
```

---

### Step 3: Set Up Clean URLs (`/external_chatbot` & `/internal_chatbot`)
To allow visitors and team members to access clean URLs without typing `.html`:

1. Open `next.config.ts`.
2. Add `rewrites()` to map `/external_chatbot` and `/internal_chatbot` to their respective HTML files:

```typescript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["images.unsplash.com"],
  },
  async rewrites() {
    return [
      {
        source: "/external_chatbot",
        destination: "/external_chatbot.html",
      },
      {
        source: "/internal_chatbot",
        destination: "/internal_chatbot.html",
      },
    ];
  },
};

module.exports = nextConfig;
```

---

### Step 4: Add Navigation Links (Optional)
Add header/navigation links in `src/app/layout.tsx` to give users easy access to the full-page chatbot portals.

```tsx
<nav className="flex gap-4">
  <Link href="/products">Products</Link>
  <Link href="/cart">Cart</Link>
  <Link href="/orders">Orders</Link>
  <Link href="/external_chatbot">Support Chat</Link>
  <Link href="/internal_chatbot">Internal BI</Link>
</nav>
```

---

### Step 5: Verification & Local Testing
Before deploying, verify everything works locally.

1. Open your terminal in `D:\Diamante Collections\website\diamante-collections\`.
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Test in your browser:
   - **Floating Widget**: Go to `http://localhost:3000` and check for the chat bubble at the bottom right.
   - **External Support Chatbot**: Go to `http://localhost:3000/external_chatbot`.
   - **Internal BI Chatbot**: Go to `http://localhost:3000/internal_chatbot`.

---

## 🌐 Step 6: How to Go Live on the Website (GitHub & Netlify Deployment)

### Question: *Do I need to upload to GitHub and then go to Netlify to redeploy?*

**Answer:** If your Netlify site is connected to your GitHub repository (Continuous Deployment):
1. **Yes, you upload (push) to GitHub**, and Netlify will **automatically detect the push and redeploy your website**.
2. You typically **do NOT need to manually trigger a deploy inside Netlify**, but you can visit Netlify to check the build status.

---

### Detailed Deployment Workflow:

#### **Option A: Standard GitHub Push (Recommended & Automatic)**

1. **Stage all changes**:
   ```bash
   git add .
   ```

2. **Commit your changes**:
   ```bash
   git commit -m "Feat: Add DIAD chatbot widget and full-page portals"
   ```

3. **Push to GitHub**:
   ```bash
   git push origin main
   ```
   *(Replace `main` with your branch name if using a different branch like `master` or `dev`).*

4. **Verify on Netlify**:
   - Log into [Netlify Dashboard](https://app.netlify.com/).
   - Select your **Diamante Collections** site.
   - Click on the **Deploys** tab.
   - You will see a deploy automatically start (e.g., *"Building commit Feat: Add DIAD chatbot widget..."*).
   - Once it shows **Published**, visit your live website domain to see the active chatbot!

---

#### **Option B: Manual Trigger on Netlify (If Auto-Deploy Is Off or Failed)**

If Netlify does not trigger automatically or you want to clear build caches:

1. Push your changes to GitHub as shown in Option A.
2. Log into [Netlify Dashboard](https://app.netlify.com/).
3. Navigate to your site → **Deploys**.
4. Click **Trigger deploy** dropdown button at the top right.
5. Select **Deploy site** (or **Clear cache and deploy site**).

---

## 🔍 Post-Deployment Verification Checklist
- [ ] Open your live URL (e.g., `https://yourdomain.com`).
- [ ] Confirm floating chat bubble loads in the bottom-right corner.
- [ ] Send a test query in the chat bubble (e.g., *"What products do you offer?"*).
- [ ] Visit `https://yourdomain.com/external_chatbot` to ensure full-page customer chatbot works.
- [ ] Visit `https://yourdomain.com/internal_chatbot` to ensure internal BI chatbot works.
