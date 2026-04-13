# Deployment Guide

The workspace is designed as a Mono-repo ready to be split into two services: Render (for the Backend API) and Vercel (for the Frontend UI).

## 🚀 Backend Deployment (Render)

We have provided a `render.yaml` infrastructure-as-code file located at the root of the project.

**Steps to deploy Backend:**
1. Push this repository to GitHub.
2. In Render Dashboard, click **New + -> Blueprint**.
3. Connect your GitHub repository.
4. Render will automatically detect the `render.yaml` file and configure the service as `smart-logistics-backend`.
5. Under Environment variables in Render, you must configure:
   - `DATABASE_URL` (Your specific Production PostgreSQL URL)
   - `OPENROUTER_API_KEY` (Your premium OpenRouter key)

*The exact specifications used by Render:*
- **Build Command:** `cd backend && pip install -r requirements.txt`
- **Start Command:** `cd backend && uvicorn backend.main:app --host 0.0.0.0 --port $PORT`

---

## 🎨 Frontend Deployment (Vercel)

The Next.js frontend is natively built to map flawlessly with Vercel zero-config deployments.

**Steps to deploy Frontend:**
1. Install Vercel CLI locally (if you want to do it from terminal):
   ```bash
   npm i -g vercel
   ```
2. Open a terminal inside the frontend folder:
   ```bash
   cd frontend
   vercel --prod
   ```
3. *(Alternative CI/CD Method)* Connect your GitHub repo in Vercel's dashboard.
   - When importing the repo, set the **Framework Preset** to `Next.js`.
   - Set the **Root Directory** to `frontend`.
   - Vercel will automatically discover the `npm run build` command and map the output.

**Frontend Environment Variables needed over Vercel:**
If you deploy the backend at a specific URL, you need to update the fetch logic inside `frontend/src/app/page.tsx` from `http://localhost:8000/api/optimize` to point to a production route like `process.env.NEXT_PUBLIC_API_URL + '/api/optimize'`, then define that env variable in Vercel.
