import { A, action, cache, createAsync, useAction } from "@solidjs/router";
import { For, Show, Suspense, type Component } from "solid-js";
import { Button } from "~/components/ui/button";
// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import { readFile } from "fs/promises";
import { readdir } from "node:fs/promises";
import { db } from "~/server/db";

//TODO add script on startup docker to decrypt json

const updateDate = action(async (date: Date, name: string) => {
	"use server";
	await db
		.updateTable("links")
		.set({ dateClicked: date })
		.where("name", "=", name)
		.execute();
});

const getShortcuts = cache(async () => {
	"use server";

	const data = JSON.parse(await readFile("public/shortcuts.json", "utf8"));

	const exists = await db.selectFrom("links").selectAll("links").execute();

	//TODO take into account new additions

	for (const i of data.shortcuts) {
		const exists = await db
			.selectFrom("links")
			.where("name", "=", i.name)
			.executeTakeFirst();
		if (!exists) {
			await db
				.insertInto("links")
				.values({ name: i.name, dateClicked: new Date() })
				.execute();
		}
	}
	for (const i of data.services) {
		const exists = await db
			.selectFrom("links")
			.where("name", "=", i.name)
			.executeTakeFirst();
		if (!exists) {
			await db
				.insertInto("links")
				.values({ name: i.name, dateClicked: new Date() })
				.execute();
		}
	}
	for (const i of data.additional) {
		const exists = await db
			.selectFrom("links")
			.where("name", "=", i.name)
			.executeTakeFirst();

		if (!exists) {
			await db
				.insertInto("links")
				.values({ name: i.name, dateClicked: new Date() })
				.execute();
		}
	}
	const dates = await db.selectFrom("links").selectAll("links").execute();

	return { json: data, dates };
}, "shortcuts");

export const route = {
	preload: () => getShortcuts(),
};

const dateConverter = (curDate: Date, dbDate: Date) => {
	const ms = dbDate - curDate;

	if (ms < 1000 * 60 * 60 * 24) {
		return `${Math.abs(Math.floor(ms / 1000 / 60))} minutes ago`;
	}
	return `${Math.abs(Math.floor(ms / 1000 / 60 / 60 / 24))} days ago`;
};

const BaseButton: Component<{ header: string; data: any; dates: any }> = (
	props,
) => {
	const curDate = new Date();
	const updateDateClient = useAction(updateDate);
	return (
		<div>
			<h1 class="max-6-xs text-4xl text-orange-400 font-thin uppercase my-16">
				{props.header}
			</h1>
			<For each={props.data}>
				{(item) => (
					<Button
						onClick={() => updateDateClient(new Date(), item.name)}
						class="p-6 text-lg bg-gray-900 flex flex-col items-center justify-start w-full max-w-64  h-full hover:scale-110 transition-all my-8 shadow-sm shadow-gray-400 border-t-orange-600 border-t-2 rounded-xl"
						as={A}
						href={`https://${item.http}`}
					>
						<div class="flex justify-start items-center w-full">
							<img
								alt="dest"
								src={`https://www.google.com/s2/favicons?domain=${item.http}`}
								width={22}
								height={22}
								class="h-6 w-6"
							/>
							<div class="ml-24">{item.name}</div>
						</div>
						<h3 class="text-sm mt-4 text-left w-full text-gray-500">
							{dateConverter(
								curDate,
								props.dates.find((e) => e.name === item.name)?.dateClicked,
							)}
						</h3>
					</Button>
				)}
			</For>
		</div>
	);
};

export default function Home() {
	const shortcuts = createAsync(() => getShortcuts());

	return (
		<div class="text-center flex-col flex max-w-screen-lg mx-auto text-gray-700 p-4 bg-gray-800">
			<div>
				<Suspense>
					<div class="flex flex-col items-center justify-start md:flex-row md:items-start md:justify-center md:gap-32">
						<BaseButton
							data={shortcuts()?.json?.shortcuts}
							header="Links"
							dates={shortcuts()?.dates}
						/>
						<BaseButton
							data={shortcuts()?.json?.services}
							header="Services"
							dates={shortcuts()?.dates}
						/>
						<BaseButton
							data={shortcuts()?.json?.additional}
							header="Additional"
							dates={shortcuts()?.dates}
						/>
					</div>
				</Suspense>
			</div>
		</div>
	);
}
