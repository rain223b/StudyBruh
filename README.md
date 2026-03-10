# Clever | Portal

A curated collection of the best web-based games.

## How to Deploy to GitHub Pages (Final Fix)

1.  **Sync to GitHub:** Click the **Sync to GitHub** button in AI Studio.
2.  **Configure GitHub Pages:**
    *   Go to your repository on **GitHub.com**.
    *   Go to **Settings** > **Pages**.
    *   Under **Build and deployment** > **Branch**:
        *   Ensure the branch is set to `main`.
        *   Change the folder from `/ (root)` to **`/docs`**.
    *   Click **Save**.
3.  **Wait 60 seconds:** Your site will be live!

### Why you saw a MIME type error:
GitHub Pages was trying to read the "blueprint" (the `index.html` in the root) instead of the "finished building" (the `index.html` in the `docs` folder). By switching the setting to `/docs`, you tell GitHub to serve the working version of the app.

I have restored the local preview, so it should be working now!

## Note on Proxy Features
The **Web Browser** and **Proxy** features require a Node.js server. Since GitHub Pages is a static host, these features will not work there. For full functionality, consider hosting on **Vercel** or **Render**.
