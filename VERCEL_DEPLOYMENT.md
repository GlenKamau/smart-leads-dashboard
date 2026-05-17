# Frontend Deployment Guide — Vercel

## Your Backend URL
https://smart-leads-api-69jn.onrender.com/

## Step 1 — Create a Vercel Account
1. Go to https://vercel.com
2. Click "Sign Up" → "Continue with GitHub"
3. Authorize Vercel to access your GitHub account

## Step 2 — Import Your Repository
1. Click "Add New" → "Project"
2. Find and select your repo "smart-leads-dashboard"
3. Click "Import"

## Step 3 — Configure the Project
Set these values exactly:

| Setting | Value |
|---------|-------|
| Framework Preset | Vite |
| Root Directory | frontend |
| Build Command | npm run build |
| Output Directory | dist |
| Install Command | npm install |
| Node.js Version | 22.x |

## Step 4 — Add Environment Variable
Click "Environment Variables" and add:

- Name: `VITE_API_URL`
- Value: `https://smart-leads-api-69jn.onrender.com/api`

## Step 5 — Deploy
1. Click "Deploy"
2. Wait 1-2 minutes for the build to finish
3. Your frontend will be live at a URL like https://smart-leads-dashboard.vercel.app

## Step 6 — Verify
- Open the Vercel URL
- You should see the login/register page
- Log in with your credentials
- If the dashboard and leads load, everything is connected
- If the page loads but API calls fail, double-check VITE_API_URL in Vercel's environment variables

## Notes
- The Vite proxy in vite.config.ts only works in local development
- In production, VITE_API_URL tells the app where to find your Render backend
- Anytime you update the frontend code, push to GitHub and Vercel will auto-deploy
