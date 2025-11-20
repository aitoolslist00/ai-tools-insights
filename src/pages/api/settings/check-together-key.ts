import type { APIRoute } from 'astro';
import { getSetting } from '../../../lib/db';

export const GET: APIRoute = async () => {
  const togetherApiKey = await getSetting('TOGETHER_API_KEY') || process.env.TOGETHER_API_KEY;
  
  return new Response(JSON.stringify({ 
    configured: !!togetherApiKey 
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
