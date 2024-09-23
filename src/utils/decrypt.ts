import crypto from "node:crypto";
import fs from "node:fs";
import { readFile } from "node:fs/promises";

const readAndDecryptFromFile = async () => {
	const encryptedFile = await readFile("../../public/encrypted.json", "utf8");
	const { iv, encryptedData } = JSON.parse(encryptedFile);

	const decipher = crypto.createDecipheriv(
		"aes-256-gcm",
		process.env.KEY as string,
		Buffer.from(iv, "hex"),
	);

	// Decrypt the encrypted data
	let decrypted = decipher.update(encryptedData, "hex", "utf8");
	decrypted += decipher.final("utf8");

	// fs.writeFileSync("../../public/shortcuts.json", JSON.stringify(decrypted));
	console.log(decrypted);
};

readAndDecryptFromFile();