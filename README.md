# Clever | Portal

A curated collection of the best web-based games.

## How to Deploy to GitHub Pages

1.  **Create a new repository** on GitHub.
2.  **Upload the files** from this project to your repository.
    *   **CRITICAL:** Do NOT upload the `node_modules` folder.
    *   **CRITICAL:** Do NOT upload the `dist` folder.
    *   **DO upload** the `.github` folder, `public` folder, `src` folder, `index.html`, `package.json`, `tsconfig.json`, and `vite.config.ts`.
3.  **Enable GitHub Actions:**
    *   Go to **Settings** > **Pages** in your GitHub repository.
    *   Under **Build and deployment** > **Source**, select **GitHub Actions**.
4.  **Wait for the build:** The deployment will start automatically. You can track it in the **Actions** tab.

## Note on Proxy Features
The **Web Browser** and **Proxy** features require a Node.js server. Since GitHub Pages is a static host, these features will not work there. For full functionality, consider hosting on **Vercel** or **Render**.
