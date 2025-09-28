import crypto from "node:crypto";
import fs from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import "dotenv/config";

const readAndDecryptFromFile = async () => {
	const encryptedData = await readFile("public/encrypted.json", "utf8");

	console.log(encryptedData)
	console.log(process.env.KEY)

	const cipherSplit = encryptedData.split("$$");
	const text = cipherSplit[0];
	const iv = Buffer.from(cipherSplit[1], "hex");
	const tag = Buffer.from(cipherSplit[2], "hex");
	const key = crypto
		.createHash("sha256")
		.update(String(process.env.KEY))
		.digest();


	const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
	decipher.setAuthTag(tag);

	// Decrypt the encrypted data
	let decrypted = decipher.update(text, "hex", "utf8");
	decrypted += decipher.final("utf8");

	writeFile("public/shortcuts.json", decrypted);
};

readAndDecryptFromFile();
