import { g as getSetting } from '../../../chunks/db_CJGLAgIX.mjs';
export { renderers } from '../../../renderers.mjs';

const GET = async () => {
  const togetherApiKey = await getSetting("TOGETHER_API_KEY") || process.env.TOGETHER_API_KEY;
  return new Response(JSON.stringify({
    configured: !!togetherApiKey
  }), {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
