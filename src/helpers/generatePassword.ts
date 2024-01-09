import { Crypto } from "@peculiar/webcrypto";
import { generateSalt } from "./generateSalt";
export interface GeneratePasswordOptions {
  service: string;
  key: number;
}
export async function generatePassword(
  options: GeneratePasswordOptions,
): Promise<string> {
  const { service, key } = options;

  const salt = await generateSalt(service);
  const crypto = new Crypto();
  const encoder = new TextEncoder();
  const data = encoder.encode(`${service}_${key}_${salt}`);

  return crypto.subtle.digest("SHA-256", data).then((hashBuffer) => {
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashedData = hashArray
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
    const specialChars = "&*$^#";
    const passwordWithSpecialChars = hashedData
      .split("")
      .map((char, index) => {
        return index % 2 === 0
          ? char
          : specialChars[index % specialChars.length];
      })
      .join("");

    return passwordWithSpecialChars.slice(0, 15);
  });
}
