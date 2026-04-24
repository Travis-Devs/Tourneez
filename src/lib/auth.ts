import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import * as schema from "./schema";
import { createDb } from "./db";

export function createAuth() {
	const db = createDb();
	return betterAuth({
		database: drizzleAdapter(db, {
			provider: "pg",
			schema,
		}),
		emailAndPassword: {
			enabled: true,
		},
		socialProviders: {
			...(process.env.GOOGLE_CLIENT_ID &&
				process.env.GOOGLE_CLIENT_SECRET && {
					google: {
						clientId: process.env.GOOGLE_CLIENT_ID,
						clientSecret: process.env.GOOGLE_CLIENT_SECRET,
					},
				}),
		},
		plugins: [tanstackStartCookies()],
	});
}
