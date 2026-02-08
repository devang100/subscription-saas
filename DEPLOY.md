# Deployment Guide

This guide describes how to deploy your Multi-tenant SaaS application to **Vercel** (Frontend) and **Render** (Backend).

## Prerequisites

1.  **GitHub Account**: You must look push this specific workspace code to a GitHub repository.
2.  **Render Account**: For deploying the backend and database.
3.  **Vercel Account**: For deploying the frontend.

---

## Part 1: Database & Backend (Render)

We will deploy the backend first because the frontend needs the backend URL.

### 1. Create a Database
1.  Log in to [dashboard.render.com](https://dashboard.render.com/).
2.  Click **New +** -> **PostgreSQL**.
3.  Name: `saas-db`.
4.  User, Database, Region: (Leave defaults).
5.  Plan: **Free** (or Starter).
6.  Click **Create Database**.
7.  **Wait** for it to become available.
8.  Copy the **"Internal Database URL"** (starting with `postgres://...`).

### 2. Deploy Backend Code
1.  Click **New +** -> **Web Service**.
2.  Connect your GitHub Repository.
3.  Select the **backend** folder (Root Directory: `backend`).
4.  **Settings**:
    *   **Name**: `saas-backend`
    *   **Region**: Same as Database.
    *   **Runtime**: **Node**
    *   **Build Command**: `npm install && npm run build`
        *   *(Note: This runs `tsc` and `prisma generate` because we added a postinstall script)*
    *   **Start Command**: `npm start`
5.  **Environment Variables** (Click "Advanced" or "Environment"):
    *   `DATABASE_URL`: Paste the **Internal Database URL** from Step 1.
    *   `JWT_SECRET`: Generate a random string.
    *   `JWT_REFRESH_SECRET`: Generate a random string.
    *   `STRIPE_SECRET_KEY`: Your **Test** Secret Key (starts with `sk_test_...`).
    *   `STRIPE_WEBHOOK_SECRET`: You need to configure a live webhook endpoint in Stripe first (see below) or leave blank for now.
    *   `FRONTEND_URL`: `https://YOUR-VERCEL-URL.vercel.app` (You will update this later).
    *   `NODE_ENV`: `production`
6.  Click **Create Web Service**.

### 3. Setup Seeds (Optional but Recommended)
Once deployed, the database is empty. You need to seed the Roles and Plans.
1.  Go to the **Shell** tab in your Render Web Service.
2.  Run: `npm run seed`
3.  (Ideally, you should also set your Stripe Price IDs in the DB using the script, e.g. `node dist/scripts/setPrice.js ...`)

---

## Part 2: Frontend (Vercel)

### 1. Deploy Frontend
1.  Log in to [vercel.com](https://vercel.com/).
2.  Click **Add New...** -> **Project**.
3.  Import your GitHub Repository.
4.  **Framework Preset**: Next.js (Default).
5.  **Root Directory**: Click "Edit" and select `frontend`.
6.  **Environment Variables**:
    *   `NEXT_PUBLIC_API_URL`: Paste your **Render Backend URL** (e.g., `https://saas-backend.onrender.com/api`).
        *   *Important*: Add `/api` at the end if your routes function that way (check `app.ts`). 
        *   *Correction*: In your local env, you used `http://localhost:4000/api`. So yes, append `/api`.
7.  Click **Deploy**.

---

## Part 3: Final Configuration

### 1. Connect Frontend to Backend
1.  Once Vercel finishes, copy your new domain (e.g., `https://my-saas.vercel.app`).
2.  Go back to **Render > Backend > Environment**.
3.  Update `FRONTEND_URL` to `https://my-saas.vercel.app` (no trailing slash).
4.  **Save Changes** (This restarts the backend).

### 2. Stripe Webhooks (Production)
1.  Go to **Stripe Dashboard > Developers > Webhooks**.
2.  Click **Add Endpoint**.
3.  **Endpoint URL**: `https://YOUR-RENDER-BACKEND.onrender.com/api/webhooks/stripe`.
4.  Events to send: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`.
5.  Click **Add endpoint**.
6.  Copy the **Signing Secret** (`whsec_...`).
7.  Go to **Render > Backend > Environment**.
8.  Add/Update `STRIPE_WEBHOOK_SECRET` with this new secret.
9.  **Save Changes**.

---

## Troubleshooting
*   **CORS Error**: Ensure `FRONTEND_URL` in Backend matches exactly (https vs http, trailing slash).
*   **Database Error**: Ensure `DATABASE_URL` is correct. If running migrations commands, ensure you use the "External Database URL" if running from your local machine, or "Internal" if running from Render Shell.
