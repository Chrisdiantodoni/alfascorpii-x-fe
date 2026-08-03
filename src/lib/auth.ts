import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { db } from "@/db"; // your drizzle instance
import * as schema from "@/db/auth-schema";
export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg", // or "mysql", "sqlite"
		schema: {
			user: schema.user, // Menghubungkan model user ke pgTable 'auth_user'
			session: schema.session, // Menghubungkan model session ke pgTable 'auth_session'
			account: schema.account, // Menghubungkan model account ke pgTable 'auth_account'
			verification: schema.verification, // Menghubungkan model verification ke pgTable 'auth_verification'
		},
		usePlural: false,
	}),

	emailAndPassword: {
		enabled: true,
	},
	plugins: [tanstackStartCookies()],
});
