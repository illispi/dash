import crypto from "node:crypto";
import fs from "node:fs";
import { readFile, writeFile } from "node:fs/promises";

const key = crypto
	.createHash("sha256")
	.update(String(process.env.KEY))
	.digest();
const iv = crypto.randomBytes(12);
// Function to encrypt a JSON object and write to a file
const encryptAndSaveToFile = async () => {
	const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
	const data = await readFile("public/shortcuts.json", "utf8");

	// Encrypt the JSON string
	let encrypted = cipher.update(data, "utf8", "hex");
	encrypted += cipher.final("hex");

	const tag = cipher.getAuthTag();

	// Write encrypted data to file
	writeFile(
		"public/encrypted.json",
		`${encrypted}$$${iv.toString("hex")}$$${tag.toString("hex")}`,
	);
};

encryptAndSaveToFile();
