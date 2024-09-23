import crypto from "node:crypto";
import fs from "node:fs";
import { readFile } from "node:fs/promises";

const key = process.env.KEY as string;
const iv = process.env.IV as string;
// Function to encrypt a JSON object and write to a file
const encryptAndSaveToFile = async () => {
	const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
	const data = JSON.parse(await readFile("public/shortcuts.json", "utf8"));

	// Convert JSON object to a string
	const jsonString = JSON.stringify(data);

	// Encrypt the JSON string
	let encrypted = cipher.update(jsonString, "utf8", "hex");
	encrypted += cipher.final("hex");

	// Write encrypted data to file
	fs.writeFileSync(
		"../../public/encrypted.json",
		JSON.stringify({ iv: iv, encryptedData: encrypted }),
	);
};

encryptAndSaveToFile();
