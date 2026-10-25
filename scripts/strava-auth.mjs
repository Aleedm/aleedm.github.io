// One-time helper: authorises the site's Strava app to read your activities and
// stores the resulting refresh token in .env.local (git-ignored).
//
// 1. Create an app at https://www.strava.com/settings/api with
//    "Authorization Callback Domain" set to: localhost
// 2. Put STRAVA_CLIENT_ID and STRAVA_CLIENT_SECRET in .env.local
// 3. npm run strava:auth, open the printed link, and approve.

import { createServer } from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';

const { STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET } = process.env;
if (!STRAVA_CLIENT_ID || !STRAVA_CLIENT_SECRET) {
  console.error('Set STRAVA_CLIENT_ID and STRAVA_CLIENT_SECRET in .env.local first.');
  process.exit(1);
}

const PORT = 8787;
const redirect = `http://localhost:${PORT}/callback`;
// activity:read covers Everyone/Followers activities; "Only me" runs stay private.
const url = `https://www.strava.com/oauth/authorize?${new URLSearchParams({
  client_id: STRAVA_CLIENT_ID, response_type: 'code', redirect_uri: redirect, approval_prompt: 'force', scope: 'read,activity:read',
})}`;

const server = createServer(async (req, res) => {
  const params = new URL(req.url, redirect).searchParams;
  if (!params.has('code')) { res.writeHead(400).end(params.get('error') ?? 'Missing code'); return; }
  const response = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    body: new URLSearchParams({ client_id: STRAVA_CLIENT_ID, client_secret: STRAVA_CLIENT_SECRET, code: params.get('code'), grant_type: 'authorization_code' }),
  });
  const token = await response.json();
  if (!response.ok || !token.refresh_token) {
    res.writeHead(500).end('Token exchange failed; see the terminal.');
    console.error(token);
    process.exit(1);
  }
  const env = new URL('../.env.local', import.meta.url);
  const lines = (await readFile(env, 'utf8').catch(() => '')).split('\n').filter((line) => line && !line.startsWith('STRAVA_REFRESH_TOKEN='));
  await writeFile(env, [...lines, `STRAVA_REFRESH_TOKEN=${token.refresh_token}`].join('\n') + '\n');
  res.writeHead(200, { 'Content-Type': 'text/plain' }).end('Connected. You can close this tab.');
  console.log(`Connected as ${token.athlete?.firstname ?? 'you'}. Refresh token saved to .env.local.`);
  console.log('Also add it to GitHub: Settings → Secrets and variables → Actions → STRAVA_REFRESH_TOKEN.');
  server.close();
});
server.listen(PORT, () => console.log(`Open this link and approve access:\n\n${url}\n`));
