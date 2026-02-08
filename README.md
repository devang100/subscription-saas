# Getting Started with the SaaS Subscription Platform

This guide will help you run the backend and frontend locally.

## Prerequisite
- **Node.js** (v18 or higher)
- **PostgreSQL Database** (running locally or a cloud URL)

---

## 🚀 1. Backend Setup

### A. Navigate to backend directory
```bash
cd backend
```

### B. Environment Setup
The code has created a `.env` file for you. Open `backend/.env` and verify:
- `DATABASE_URL`: Ensure this points to your running Postgres instance.
  - Example: `postgresql://postgres:password@localhost:5432/subscription_saas?schema=public`
  - **Action**: Create a database named `subscription_saas` in your Postgres if it doesn't exist.

### C. Database Migration & Seeding
Run the following commands to create tables and insert default Roles/Permissions:
```bash
# 1. Initialize Database Schema
npx prisma migrate dev --name init

# 2. Seed Database (Roles: Owner, Admin, Member)
npx prisma db seed
```

### D. Start the Server
```bash
npm run dev
```
Server should be running at `http://localhost:4000`.

---

## 🎨 2. Frontend Setup

### A. Navigate to frontend directory
Open a new terminal:
```bash
cd frontend
```

### B. Start the App
Dependencies are already installed.
```bash
npm run dev
```
App should be running at `http://localhost:3000`.

---

## ✅ 3. Verify the App

1. Go to `http://localhost:3000/register`.
2. Create a new account (e.g., `user@example.com`).
3. You will be redirected to the Dashboard.
4. You should see your Organization created automatically.
5. You can now invite users, manage billing (simulated), etc.

## Troubleshooting

- **Database Errors**: Ensure your Postgres server is running and the credentials in `.env` are correct.
- **Permission Errors**: If you see "Permission Denied", ensure you ran `npx prisma db seed`.

