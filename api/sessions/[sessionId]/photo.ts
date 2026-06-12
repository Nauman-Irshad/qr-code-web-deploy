import { head, put } from "@vercel/blob";

export const config = { runtime: "nodejs" };

type Ctx = { params: Promise<{ sessionId: string }> };

export async function GET(_req: Request, ctx: Ctx): Promise<Response> {
  const { sessionId } = await ctx.params;
  const key = `sessions/${sessionId}.jpg`;
  try {
    const meta = await head(key);
    if (!meta?.url) {
      return new Response("Not found", { status: 404 });
    }
    const img = await fetch(meta.url);
    return new Response(await img.arrayBuffer(), {
      headers: {
        "Content-Type": meta.contentType || "image/jpeg",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}

export async function POST(req: Request, ctx: Ctx): Promise<Response> {
  const { sessionId } = await ctx.params;
  const form = await req.formData();
  const photo = form.get("photo");
  if (!photo || !(photo instanceof Blob)) {
    return Response.json(
      { detail: "Missing photo" },
      { status: 400, headers: { "Access-Control-Allow-Origin": "*" } },
    );
  }

  await put(`sessions/${sessionId}.jpg`, photo, {
    access: "public",
    addRandomSuffix: false,
    contentType: photo.type || "image/jpeg",
  });

  return Response.json(
    { status: "ok" },
    { headers: { "Access-Control-Allow-Origin": "*" } },
  );
}

export async function OPTIONS(): Promise<Response> {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
