import type { APIRoute } from 'astro';
import { requireAuth } from '../../../lib/auth';
import { setSetting } from '../../../lib/db';

export const POST: APIRoute = async ({ request }) => {
  try {
    await requireAuth(request);

    const { geminiApiKeys, newsApiKeys } = await request.json();

    if (geminiApiKeys !== undefined && geminiApiKeys !== null) {
      if (Array.isArray(geminiApiKeys)) {
        const validKeys = geminiApiKeys.filter(key => key && key.trim().length > 0);
        await setSetting('GEMINI_API_KEYS', JSON.stringify(validKeys));
        console.log(`Saved ${validKeys.length} Gemini API keys`);
      }
    }

    if (newsApiKeys !== undefined && newsApiKeys !== null) {
      if (Array.isArray(newsApiKeys)) {
        const validKeys = newsApiKeys.filter(key => key && key.trim().length > 0);
        await setSetting('NEWSAPI_KEYS', JSON.stringify(validKeys));
        console.log(`Saved ${validKeys.length} NewsAPI keys`);
      }
    }

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Settings saved successfully'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Settings save error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to save settings' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
