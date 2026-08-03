import "dotenv/config";

import { drizzle } from "drizzle-orm/node-postgres";
import * as businessSchema from "../drizzle/schema.ts";
import {
	account,
	accountRelations,
	session,
	sessionRelations,
	user,
	userRelations,
	verification,
} from "./auth-schema.ts";
import * as businessRelations from "./relations.ts";

export const db = drizzle(process.env.DATABASE_URL!, {
	schema: {
		...businessSchema,
		user,
		session,
		account,
		verification,
		...businessRelations,
		userRelations,
		sessionRelations,
		accountRelations,
	},
});

// --- bare instance (tanpa schema/relations) ---
// import { drizzle } from "drizzle-orm/node-postgres";
// export const db = drizzle(process.env.DATABASE_URL!);
