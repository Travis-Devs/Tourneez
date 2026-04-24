import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

export function createDb() {
	const client = postgres(process.env.DATABASE_URL!, {
		prepare: false, // required for Supabase transaction mode pooler
	});
	return drizzle({ client });
}
