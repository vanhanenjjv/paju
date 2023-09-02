import type { RequestHandler } from "@sveltejs/kit";
import { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET } from "$env/static/private";

function formBody(params: Record<string, string>): string {
  return Object
    .entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
}

export const POST: RequestHandler = async ({ request }) => {
  const params = new URLSearchParams(request.url)

  const code = params.get('code')

  if (code === null) {
    console.error('No code provided in request')
    return new Response("No code provided", {
      status: 400
    })
  }

  const response = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: formBody({
      'client_id': DISCORD_CLIENT_ID,
      'client_secret': DISCORD_CLIENT_SECRET,
      'grant_type': 'authorization_code',
      'code': code,
      // TODO: Make this configurable
      'redirect_uri': 'https://paju.pages.dev/auth/discord/callback'
    })
  })

  if (!response.ok) {
    console.error('Failed to exchange code for token', response.body)
    return new Response("Internal server error", {
      status: 500
    })
  }

  const json = await response.json()
  console.log(JSON.stringify(Object.keys(json)))

  return new Response("Hello world!")
}
