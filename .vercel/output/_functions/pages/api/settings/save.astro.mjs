import { r as requireAuth } from '../../../chunks/auth_DteQtQsy.mjs';
import { s as setSetting } from '../../../chunks/db_CbTj92s0.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request }) => {
  try {
    await requireAuth(request);
    const { geminiApiKeys, newsApiKeys } = await request.json();
    if (geminiApiKeys !== void 0 && geminiApiKeys !== null) {
      if (Array.isArray(geminiApiKeys)) {
        const validKeys = geminiApiKeys.filter((key) => key && key.trim().length > 0);
        await setSetting("GEMINI_API_KEYS", JSON.stringify(validKeys));
        console.log(`Saved ${validKeys.length} Gemini API keys`);
      }
    }
    if (newsApiKeys !== void 0 && newsApiKeys !== null) {
      if (Array.isArray(newsApiKeys)) {
        const validKeys = newsApiKeys.filter((key) => key && key.trim().length > 0);
        await setSetting("NEWSAPI_KEYS", JSON.stringify(validKeys));
        console.log(`Saved ${validKeys.length} NewsAPI keys`);
      }
    }
    return new Response(JSON.stringify({
      success: true,
      message: "Settings saved successfully"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Settings save error:", error);
    return new Response(JSON.stringify({
      error: "Failed to save settings"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
