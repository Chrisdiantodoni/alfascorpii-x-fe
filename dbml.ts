import * as businessSchema from "./src/drizzle/schema";
import * as schemaAuth from "./src/db/auth-schema";
import * as relations from "./src/drizzle/relations";
import { pgGenerate } from "drizzle-dbml-generator"; // Using Postgres for this example

const out = "./schema.dbml";
const relational = true;

const schema = {
  ...businessSchema,
  ...relations,
  ...schemaAuth,
};

pgGenerate({ schema, out, relational });
