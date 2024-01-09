import { CommandModule } from "yargs";
import {
  generatePassword,
  GeneratePasswordOptions,
} from "../helpers/generatePassword";
import * as prompts from "prompts";

// Define the 'generate' command with its options and handler.
const generate: CommandModule<NonNullable<unknown>, GeneratePasswordOptions> = {
  command: "generate",
  aliases: "g",
  describe:
    "Main method that generates a password based on provided parameters",
  builder: {
    // Option for specifying the service name.
    service: {
      type: "string",
      describe: "Name of the service for password generation",
      alias: "s",
    },
    // Option for specifying the secret key.
    key: {
      type: "number",
      describe: "Secret key for password generation",
      alias: "k",
    },
  },
  handler: async ({ service, key }: GeneratePasswordOptions): Promise<void> => {
    try {
      let options: GeneratePasswordOptions;

      // If both parameters are passed as flags.
      if (service && key) {
        options = { service, key };
      } else if (service) {
        // If only the service is passed, prompt the user for the key.
        const response = await prompts({
          type: "number",
          name: "key",
          message: "Enter secret key:",
          validate: (value) =>
            typeof value === "number" ? true : "Please enter a valid number",
        });

        options = { service, key: response.key as number };
      } else {
        // If neither parameter is passed, prompt the user for both.
        const response = await prompts([
          {
            type: "text",
            name: "service",
            message: "Enter service name:",
          },
          {
            type: "number",
            name: "key",
            message: "Enter secret key:",
            validate: (value) =>
              typeof value === "number" ? true : "Please enter a valid number",
          },
        ]);

        options = {
          service: response.service as string,
          key: response.key as number,
        };
      }

      // Generate the password based on the provided options.
      const password = await generatePassword(options);
      console.log(`Generated Password: ${password}`);
    } catch (error) {
      // Handle and log any errors that occur during the process.
      console.error("Error:", error);
    }
  },
};

export default generate;
