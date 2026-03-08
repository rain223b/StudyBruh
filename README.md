# Clever | Portal

A curated collection of the best web-based games.

## How to Deploy to GitHub Pages (The Easy Way)

1.  **Sync to GitHub:** Click the **Sync to GitHub** button in AI Studio.
2.  **Configure GitHub Pages:**
    *   Go to your repository on **GitHub.com**.
    *   Go to **Settings** > **Pages**.
    *   Under **Build and deployment** > **Branch**:
        *   Ensure the branch is set to `main`.
        *   Change the folder from `/ (root)` to **`/docs`**.
    *   Click **Save**.
3.  **Wait a minute:** Your site will be live at the URL shown on that page!

## Why this works
I have configured the project to build the website into a `docs` folder. By telling GitHub to serve from this folder, it will serve the ready-to-run version of your site instead of the raw code.

## Note on Proxy Features
The **Web Browser** and **Proxy** features require a Node.js server. Since GitHub Pages is a static host, these features will not work there. For full functionality, consider hosting on **Vercel** or **Render**.
