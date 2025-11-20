import { v as verifyCredentials, g as generateToken } from '../../../chunks/auth_DteQtQsy.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request, cookies }) => {
  try {
    const { username, password } = await request.json();
    if (!username || !password) {
      return new Response(JSON.stringify({ error: "Username and password are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const user = await verifyCredentials(username, password);
    if (!user) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    const token = await generateToken(user);
    cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24,
      path: "/"
    });
    return new Response(JSON.stringify({ success: true, user }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Login error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
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
