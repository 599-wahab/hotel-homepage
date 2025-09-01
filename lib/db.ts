// lib/db.ts
import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in .env.local");
}

// create the neon client
const client = neon(process.env.DATABASE_URL);

// export the raw client if you want tagged-template usage elsewhere
export const rawSql = client as any;

/**
 * run(query, params?) -> returns Promise<Record<string, any>[]>
 * Handles different client return shapes:
 *  - client.query(...) may return { rows: [...] } or an array directly
 *  - client(sqlString, params) (tagged-template) returns an array
 */
export async function run(query: string, params?: any[]) : Promise<Record<string, any>[]> {
  // prefer query(...) conventional call (works with placeholders like $1)
  if (typeof (client as any).query === "function") {
    const res = await (client as any).query(query, params);
    // res may be { rows } or an array
    if (Array.isArray(res)) return res;
    if (res && Array.isArray(res.rows)) return res.rows;
    // fallback: return res (if it's already array-like)
    return Array.isArray(res) ? res : [];
  }

  // fallback: try calling client as a tagged-template function (not ideal for placeholders)
  try {
    const res = await (client as any)(query, params);
    if (Array.isArray(res)) return res;
    if (res && Array.isArray(res.rows)) return res.rows;
    return Array.isArray(res) ? res : [];
  } catch (err) {
    throw err;
  }
}
