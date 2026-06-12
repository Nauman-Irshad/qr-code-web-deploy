/** Pass explicit Blob store/token so uploads work when OIDC is not injected. */
export function blobAuthOptions(): { token?: string; storeId?: string } {
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  const storeId = process.env.BLOB_STORE_ID?.trim();
  const opts: { token?: string; storeId?: string } = {};
  if (token) opts.token = token;
  if (storeId) opts.storeId = storeId;
  return opts;
}
