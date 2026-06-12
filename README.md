# SmartFitao QR Phone Capture

Standalone phone camera page for **2D Try-On**. User scans a QR on desktop → opens this site on phone → takes a full-body photo → photo syncs to the try-on app.

## Deploy on Vercel

1. Import [Nauman-Irshad/qr-code-web-deploy](https://github.com/Nauman-Irshad/qr-code-web-deploy) on Vercel.
2. **Framework preset:** Other  
3. **Root directory:** `./`  
4. **Build command:** leave empty (no build)  
5. **Output directory:** leave empty  
6. **Connect Blob store to this project:**
   - Vercel → **Storage** → your store (e.g. `qr-code-scan-computer-visio-blob`) → **Connect to** → **`qr-code-web-deploy`**
   - Enable **read-write token** or use OIDC (you should see `BLOB_STORE_ID` in project env vars).
   - **Redeploy** after connecting.
   - Test: `https://YOUR-APP.vercel.app/api/health` → should show `"blobStoreLinked": true`.

   QR photos save to `sessions/{session-id}.jpg` (not the old `captures/` folder).

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
