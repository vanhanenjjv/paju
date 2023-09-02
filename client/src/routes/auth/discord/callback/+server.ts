import type { RequestHandler } from "@sveltejs/kit";
import { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET } from "$env/static/private";

export const POST: RequestHandler = async () => {
  console.log(DISCORD_CLIENT_ID.length)
  console.log(DISCORD_CLIENT_SECRET.length)
  return new Response("Hello world!")
}
