import express from "express";
import { createServer as createViteServer } from "vite";
import axios from "axios";
import * as cheerio from "cheerio";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Proxy Endpoint
  app.get("/api/proxy", async (req, res) => {
    const targetUrl = req.query.url as string;
    if (!targetUrl) {
      return res.status(400).send("URL is required");
    }

    try {
      const response = await axios.get(targetUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Referer": new URL(targetUrl).origin,
        },
        responseType: "text",
        validateStatus: (status) => status < 500, // Allow 404 to be handled gracefully
      });

      if (response.status === 404) {
        return res.status(404).send(`
          <div style="font-family: sans-serif; padding: 20px; text-align: center; color: #fff; background: #09090b; height: 100vh; display: flex; flex-direction: column; justify-content: center;">
            <h2 style="font-size: 2rem; margin-bottom: 1rem;">404 - Page Not Found</h2>
            <p style="color: #a1a1aa; margin-bottom: 2rem;">The game at <strong>${targetUrl}</strong> could not be found.</p>
            <p style="color: #a1a1aa; margin-bottom: 2rem;">This often happens if the source website has moved or deleted the file.</p>
            <button onclick="window.history.back()" style="padding: 12px 24px; cursor: pointer; background: #10b981; border: none; border-radius: 8px; font-weight: bold; color: #000;">Go Back</button>
          </div>
        `);
      }

      const html = response.data;
      const $ = cheerio.load(html);
      const baseUrl = new URL(targetUrl);

      // --- AD BLOCKING LOGIC ---
      // Remove common ad scripts and elements
      const adSelectors = [
        'script[src*="googlesyndication"]',
        'script[src*="doubleclick"]',
        'script[src*="gamemonetize.com/ads.js"]',
        'script[src*="adnxs.com"]',
        'script[src*="amazon-adsystem"]',
        'script[src*="highrevenuecpmnetwork.com"]',
        'ins.adsbygoogle',
        'div[id^="google_ads"]',
        'iframe[src*="googleads"]',
        'iframe[src*="doubleclick"]'
      ];
      $(adSelectors.join(',')).remove();

      // Block scripts that contain ad-related keywords
      $('script').each((_, el) => {
        const content = $(el).html() || "";
        if (content.includes('adsbygoogle') || content.includes('gamemonetize.com/ads.js')) {
          $(el).remove();
        }
      });
      // --- END AD BLOCKING ---

      // Add a <base> tag to help the browser resolve relative URLs correctly
      $("head").prepend(`<base href="${baseUrl.origin}${baseUrl.pathname}">`);

      // Rewrite links and assets
      $("a, link, script, img, iframe, source, video, object, embed").each((_, el) => {
        const tag = $(el).prop("tagName").toLowerCase();
        let attr = "src";
        if (tag === "a" || tag === "link") attr = "href";
        if (tag === "object") attr = "data";
        
        const val = $(el).attr(attr);

        if (val && !val.startsWith("data:") && !val.startsWith("javascript:") && !val.startsWith("#")) {
          try {
            const absoluteUrl = new URL(val, baseUrl.href).href;
            
            if (tag === "a") {
              // Only proxy internal links
              if (absoluteUrl.includes(baseUrl.hostname)) {
                $(el).attr("href", `/api/proxy?url=${encodeURIComponent(absoluteUrl)}`);
              }
            } else if (tag === "iframe") {
              // Proxy nested iframes too
              $(el).attr("src", `/api/proxy?url=${encodeURIComponent(absoluteUrl)}`);
            }
          } catch (e) {
            // Ignore invalid URLs
          }
        }
      });

      // Inject a small script to handle form submissions and dynamic link clicks
      $("head").append(`
        <script>
          // Handle form submissions
          document.addEventListener('submit', (e) => {
            const form = e.target;
            if (form.action && !form.action.startsWith('javascript:')) {
              e.preventDefault();
              const url = new URL(form.action, window.location.href).href;
              const method = form.method || 'GET';
              if (method.toUpperCase() === 'GET') {
                const params = new URLSearchParams(new FormData(form)).toString();
                window.location.href = '/api/proxy?url=' + encodeURIComponent(url + (params ? '?' + params : ''));
              }
            }
          });

          // Intercept dynamic link clicks (for SPAs)
          document.addEventListener('click', (e) => {
            const anchor = e.target.closest('a');
            if (anchor && anchor.href && !anchor.href.startsWith('javascript:') && !anchor.href.startsWith('mailto:') && !anchor.href.includes('/api/proxy')) {
               // Only intercept if it's not already proxied
               const url = anchor.href;
               if (url.startsWith('http')) {
                 e.preventDefault();
                 window.location.href = '/api/proxy?url=' + encodeURIComponent(url);
               }
            }
          }, true);

          // Try to prevent breakout
          window.onbeforeunload = function() {
            return "Are you sure you want to leave the game?";
          };
        </script>
      `);

      // Set some headers to help with compatibility
      res.setHeader("Content-Security-Policy", "default-src * 'unsafe-inline' 'unsafe-eval'; img-src * data:; media-src *;");
      res.setHeader("X-Frame-Options", "ALLOWALL"); // Try to override
      res.send($.html());
    } catch (error: any) {
      console.error("Proxy error:", error.message);
      res.status(500).send(`Proxy Error: ${error.message}`);
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
