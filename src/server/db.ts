import { CamelCasePlugin, Kysely, PostgresDialect } from "kysely";
import type { DB } from "kysely-codegen";
import pkg from "pg";
const { Pool } = pkg;
//import { Pool } from "pg";

export const pool = new Pool({
	host: process.env.PSQL_HOST,
	database: process.env.POSTGRES_DATABASE,
	password: process.env.POSTGRES_PASSWORD,
	user: process.env.POSTGRES_USERNAME,
	port: 5432,
});

const dialect = new PostgresDialect({
	pool,
});

export const db = new Kysely<DB>({
	log: ["error"],
	dialect,
	plugins: [new CamelCasePlugin()],
});
