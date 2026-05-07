import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;
      try {
        await pool.query(
          `INSERT INTO users (id, username, full_name, language, profile_key, balance, created_at)
           VALUES (
             (SELECT COALESCE(MAX(id), 0) + 1 FROM users),
             $1, $2, 'ru',
             md5($1 || now()::text),
             0, NOW()
           )
           ON CONFLICT DO NOTHING`,
          [user.email, user.name ?? user.email]
        );
      } catch (err) {
        console.error("DB error on Google signIn:", err);
        return false;
      }
      return true;
    },
    async session({ session }) {
      if (session.user?.email) {
        const res = await pool.query( //adding profile_key and balance to session
          `SELECT id, profile_key, balance FROM users WHERE username = $1`, 
          [session.user.email] 
        );
        if (res.rows[0]) {
          (session.user as any).profileKey = res.rows[0].profile_key;
          (session.user as any).dbId = res.rows[0].id;
          (session.user as any).balance = res.rows[0].balance;
        }
      }
      return session;
    },
  },
});