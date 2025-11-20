import * as jose from 'jose';
import bcrypt from 'bcrypt';
import { d as db } from './db_DT4W4eUV.mjs';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default_dev_secret_change_in_production"
);
async function verifyCredentials(username, password) {
  const stmt = db.prepare("SELECT * FROM users WHERE username = ?");
  const user = await stmt.get(username);
  if (!user) return null;
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;
  return {
    id: user.id,
    username: user.username
  };
}
async function generateToken(user) {
  const token = await new jose.SignJWT({ userId: user.id, username: user.username }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("24h").sign(JWT_SECRET);
  return token;
}
async function verifyToken(token) {
  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET);
    return {
      id: payload.userId,
      username: payload.username
    };
  } catch {
    return null;
  }
}
function getAuthCookie(request) {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return null;
  const cookies = Object.fromEntries(
    cookieHeader.split("; ").map((c) => {
      const [key, ...v] = c.split("=");
      return [key, v.join("=")];
    })
  );
  return cookies["auth-token"] || null;
}
async function requireAuth(request) {
  const token = getAuthCookie(request);
  if (!token) throw new Error("Not authenticated");
  const user = await verifyToken(token);
  if (!user) throw new Error("Invalid token");
  return user;
}

export { generateToken as g, requireAuth as r, verifyCredentials as v };
