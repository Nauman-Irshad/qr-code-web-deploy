# SmartFitao QR Phone Capture

Standalone phone camera page for **2D Try-On**. User scans a QR on desktop → opens this site on phone → takes a full-body photo → photo syncs to the try-on app.

## Deploy on Vercel

1. Import [Nauman-Irshad/qr-code-web-deploy](https://github.com/Nauman-Irshad/qr-code-web-deploy) on Vercel.
2. **Framework preset:** Other  
3. **Root directory:** `./`  
4. **Build command:** leave empty (no build)  
5. **Output directory:** leave empty  
6. **Connect Blob store to this project:**
   - Vercel → **Storage** → `qr-code-scan-computer-visio-blob` → **Projects** → **qr-code-web-deploy**
   - In **qr-code-web-deploy** → **Settings** → **Environment Variables**, you need **`BLOB_READ_WRITE_TOKEN`** (or OIDC). If only `BLOB_STORE_ID` is present, open the Blob store → **Quickstart** → copy the read-write token → add as `BLOB_READ_WRITE_TOKEN` on the project → **Redeploy**.
   - Test: `https://qr-code-web-deploy.vercel.app/api/health` → `"blobStoreLinked": true`

   **Note:** Old files under `captures/` are from an earlier flow. QR now saves to **`sessions/{phone_session}.jpg`** (Blob) **or** Firestore `phone_tryon_sync` (works without Blob token).

7. **Firestore fallback (optional):** Firebase → Firestore → Rules → allow `phone_tryon_sync` read/write.

After deploy, your capture URL is:

`https://YOUR-PROJECT.vercel.app/phone-capture?phone_session=SESSION_ID`

## Connect to main 2D Try-On app

On your **main** try-on Vercel project, set:

```env
VITE_CV_PHONE_URL=https://YOUR-PROJECT.vercel.app/phone-capture
```

Rebuild/redeploy the main app. The QR modal will point phones to this service and poll photos from its `/api/sessions/*` endpoints.

## Local test

```bash
npm install
npx vercel dev
```

Open `http://localhost:3000/phone-capture?phone_session=test123`
