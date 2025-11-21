import type { APIRoute } from 'astro';
import { requireAuth } from '../../../lib/auth';

export const POST: APIRoute = async ({ request }) => {
  try {
    await requireAuth(request);

    return new Response(JSON.stringify({ 
      error: 'Migration endpoint is disabled in production. Use local environment for data migration.'
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ 
      error: error.message || 'Migration failed'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
