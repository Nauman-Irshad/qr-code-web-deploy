import { head } from "@vercel/blob";

export const config = { runtime: "nodejs" };

const CORS = { "Access-Control-Allow-Origin": "*" };

/** Open /api/health to verify Blob is linked to this project. */
export async function GET(): Promise<Response> {
  const blobStoreId = process.env.BLOB_STORE_ID?.trim() || null;
  const hasOidc = !!process.env.VERCEL_OIDC_TOKEN;
  const hasToken = !!process.env.BLOB_READ_WRITE_TOKEN;

  let blobOk = false;
  let blobError: string | null = null;
  if (blobStoreId || hasToken) {
    try {
      await head("sessions/__health_check__.jpg");
      blobOk = true;
    } catch (e) {
      blobError = e instanceof Error ? e.message : "blob head failed";
      blobOk = true;
    }
  }

  return Response.json(
    {
      ok: !!(blobStoreId || hasToken),
      blobStoreLinked: !!blobStoreId,
      blobAuth: hasOidc ? "oidc" : hasToken ? "token" : "none",
      blobReachable: blobOk,
      uploadPath: "sessions/{phone_session}.jpg",
      note: "Old captures/ folder is a different path — QR uses sessions/ via /api/sessions/*",
      detail: blobError,
    },
    { headers: CORS },
  );
}
