import { A, cache, createAsync } from "@solidjs/router";
import { For, Show, Suspense } from "solid-js";
import { Button } from "~/components/ui/button";
// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import { readFile } from "fs/promises";
import { readdir } from "node:fs/promises";

//TODO add script on startup docker to decrypt json

const getShortcuts = cache(async () => {
	"use server";
	const data = JSON.parse(await readFile("public/shortcuts.json", "utf8"));
	return data;
}, "shortcuts");

export const route = {
	load: () => getShortcuts(),
};

export default function Home() {
	const shortcuts = createAsync(() => getShortcuts());
	return (
		<div class="text-center flex-col flex max-w-screen-lg mx-auto text-gray-700 p-4">
			<div>
				<Suspense>
						<div class="flex flex-col items-center justify-start md:flex-row md:items-start md:justify-center md:gap-32">
							<div>
								<h1 class="max-6-xs text-4xl text-sky-700 font-thin uppercase my-16">
									Links
								</h1>
								<For each={shortcuts()?.shortcuts}>
									{(item) => (
										<Button
											class="p-6 text-lg bg-gray-800 flex items-center justify-start w-full max-w-64 max-h-12 h-full hover:scale-110 transition-all my-8"
											as={A}
											href={`https://${item.http}`}
										>
											<img
												alt="dest"
												src={`https://www.google.com/s2/favicons?domain=${item.http}`}
											/>
											<div class="ml-24">{item.name}</div>
										</Button>
									)}
								</For>
							</div>
							<div>
								<h1 class="max-6-xs text-4xl text-sky-700 font-thin uppercase my-16">
									Services
								</h1>
								<For each={shortcuts()?.services}>
									{(item) => (
										<Button
											class="p-6 text-lg bg-gray-800 flex items-center justify-start w-full max-w-64 max-h-12 h-full hover:scale-110 transition-all my-8"
											as={A}
											href={`https://${item.http}`}
										>
											<img
												alt="dest"
												src={`https://www.google.com/s2/favicons?domain=${item.http}`}
											/>
											<div class="ml-24">{item.name}</div>
										</Button>
									)}
								</For>
							</div>
						</div>
				</Suspense>
			</div>
		</div>
	);
}
