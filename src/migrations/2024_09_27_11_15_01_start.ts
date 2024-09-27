import type { Kysely } from "kysely";
import { sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable("links")
		.addColumn("id", "serial", (col) => col.primaryKey())
		.addColumn("name", "text", (col) => col.notNull().unique())
		.addColumn("date_clicked", "timestamp", (col) => col.defaultTo(null))
		.execute();
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable("links").ifExists().execute();
}
