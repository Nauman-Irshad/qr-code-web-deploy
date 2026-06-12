import { head } from "@vercel/blob";

export const config = { runtime: "nodejs" };

type Ctx = { params: Promise<{ sessionId: string }> };

export async function GET(_req: Request, ctx: Ctx): Promise<Response> {
  const { sessionId } = await ctx.params;
  try {
    const photo = await head(`sessions/${sessionId}.jpg`);
    return Response.json(
      { ready: !!photo },
      { headers: { "Access-Control-Allow-Origin": "*" } },
    );
  } catch {
    return Response.json(
      { ready: false },
      { headers: { "Access-Control-Allow-Origin": "*" } },
    );
  }
}

export async function OPTIONS(): Promise<Response> {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
    },
  });
}
