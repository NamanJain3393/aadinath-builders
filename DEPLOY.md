# Deployment Guide for Aadinath Builders

This project is split into two parts: `frontend` (React + Vite) and `backend` (Node.js + Express). You will deploy them separately.

## 1. Prerequisites
- **GitHub Account**: Push this entire project to a new GitHub repository.
- **Render.com Account**: To host the Backend.
- **Vercel Account**: To host the Frontend.
- **MongoDB Atlas**: Ensure you have a cloud database connection string.

---

## 2. Deploy Backend (Render.com)
1.  Log in to [Render](https://render.com).
2.  Click **New +** -> **Web Service**.
3.  Connect your GitHub repository.
4.  **Root Directory**: `backend` (Important! Do not leave blank).
5.  **Build Command**: `npm install`.
6.  **Start Command**: `node server.js`.
7.  **Environment Variables**:
    - `MONGO_URI`: `mongodb+srv://...` (Your cloud DB string)
    - `JWT_SECRET`: `some_secret_key`
    - `NODE_ENV`: `production`
8.  Click **Deploy Web Service**.
9.  After deployment, copy the **Render URL** (e.g., `https://aadinath-backend.onrender.com`).

---

## 3. Deploy Frontend (Vercel)
1.  Log in to [Vercel](https://vercel.com).
2.  Click **Add New...** -> **Project**.
3.  Import your GitHub repository.
4.  **Framework Preset**: Vite.
5.  **Root Directory**: Click "Edit" and select `frontend`.
6.  **Environment Variables**:
    - **Name**: `VITE_API_URL`
    - **Value**: `https://aadinath-backend.onrender.com` (The URL you copied from Render).
    - **Important**: Do NOT add a trailing slash `/` at the end of the URL.
7.  Click **Deploy**.

---

## 4. Final Configuration
1.  Once the Frontend is deployed, copy its URL (e.g., `https://aadinath-builders.vercel.app`).
2.  Go back to **Render** (Backend Dashboard).
3.  Add a new Environment Variable (or update CORS settings in code if strict):
    - Currently, the backend allows ALL origins (`cors()`), so it should work immediately.
4.  Open your Vercel website and test the functionality!

---

## 5. Image Uploads
## 5. Image Uploads (Already Configured!)
We have successfully enabled **Cloudinary** for image uploads in your backend only.
- When you deploy to Render, you **MUST** add these 3 variables to your Render Environment Variables:
    1. `CLOUDINARY_CLOUD_NAME`
    2. `CLOUDINARY_API_KEY`
    3. `CLOUDINARY_API_SECRET`
- You can find the values for these in your local `backend/.env` file.
- Without these, image uploads will fail in production.
