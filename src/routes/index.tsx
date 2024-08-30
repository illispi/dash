import { A } from "@solidjs/router";
import { Button } from "~/components/ui/button";

export default function Home() {
	return (
		<div class="text-center flex-col flex max-w-screen-lg mx-auto text-gray-700 p-4">
			<h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">
				Dashboard
			</h1>
			<div>
				<Button
					class="p-4 text-lg bg-gray-800 flex items-center justify-evenly w-full max-w-64 max-h-12 h-full"
					as={A}
					href="https://reddit.com"
				>
					<img src="https://www.google.com/s2/favicons?domain=reddit.com" />
					Reddit home
				</Button>
			</div>
		</div>
	);
}
