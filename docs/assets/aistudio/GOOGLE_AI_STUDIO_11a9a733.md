# Continue Camellia Shop in your existing Google AI Studio app

This code updates the existing React/Vite/Node project; it does not create an AI Studio app or update your GitHub repository automatically. Save a backup of your current Studio app first.

## Choose how to bring the changes in

1. **Ask the existing Studio app to build the upgrade in place.** Open the original Camellia Shop app in Google AI Studio **Build** mode and paste the accompanying `Camellia_AI_Studio_Build_Prompt.txt` into its chat. Studio will generate its own implementation; review and test the actual changes it makes. The prompt does not by itself copy this tested code into the app.
2. **Use the tested implementation.** Put the supplied source code changes on the GitHub branch linked to your existing AI Studio app, review and merge them, then open the app's **Settings → GitHub** and pull the changes. AI Studio's conflict-resolution dialog may require your review. The accompanying binary patch was created against public repository commit `beada2625d75a24bdb65d0b2eaecab89104fd1e0`; do not apply it blindly over newer or uncommitted work. A full source ZIP is also supplied. GitHub import normally creates a new app, so GitHub **pull** is the appropriate route when keeping your current Studio app.

If Studio offers an option to upload an archive or file into the **Code** editor, it may be possible to supply the update there instead. Interface availability can vary; verify paths, take a backup, and ask the builder to merge rather than overwrite unrelated changes. Do not assume that attaching a ZIP to a chat automatically installs its code.

## Run and verify in Studio

- The app uses Node.js, React, Vite and Express. `npm run dev` starts the server and client together; it binds to `0.0.0.0` on `PORT` (default `3000`).
- Run `npm run lint`, `npm test` and `npm run build`. Open the Studio preview and test region selection, search, product links, saving, comparison and the buying guide.
- Preserve the Impact and Mitgo verification tags in `index.html`. The root-anchored `/data/` ignore rule is intentional: an unanchored `data/` ignores `src/data/` and breaks the build.
- You do not need Gemini or a secret for the deterministic recommendations. Optional owner-side Gemini control requires `GEMINI_API_KEY` and `SITE_CONTROL_SECRET` in Studio's server-side **Secrets**; never put them in a `VITE_` variable or frontend file.

## Persistence and deployment

The included backend writes anonymized recommendation events to a JSON file. A local file is useful for a single process and development, **but AI Studio/Cloud Run containers can restart or be replaced, so it is not durable production storage**. Add and configure a managed database such as Firestore before relying on long-term, multi-instance persistence; confirm provisioning, security rules, privacy/consent and potential costs with the owner. The provided code does not claim a Firestore integration has already been configured.

GitHub Pages hosts the static frontend only. Local recommendations, manual region selection and saved items still work there; network-based detection and server-side personalization require a separately running Node backend and a `VITE_API_BASE_URL` set at build time. See `README.md` for the setup and the actual limitations.

Prices and availability are verified at the merchant, not live in the catalog. Verify affiliate-account approval, destinations, image permissions and partner terms before publishing.

Google's Build mode documentation: https://ai.google.dev/gemini-api/docs/aistudio-build-mode
