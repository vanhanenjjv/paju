import type { RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request, platform }) => {
  return new Response("Hello world!")
}
