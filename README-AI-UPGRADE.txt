# Vincent AI real AI engine

Replace `package.json` with this version and create `app/api/chat/route.ts`.

Vercel Environment Variable:
OPENAI_API_KEY=<your new key>

The API key is server-side only. Do not put it in page.tsx or commit it to GitHub.

Then connect the existing page.tsx Send action to POST /api/chat with:
{
  "message": "...",
  "history": [{"role":"user","text":"..."}]
}
Vincent AI V4 deployment synchronization.
