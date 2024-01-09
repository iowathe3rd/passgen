import * as yargs from "yargs";
import { GeneratePasswordOptions } from "./helpers/generatePassword";
import generate from "./modules/generate";

yargs
  .scriptName("passgen")
  .usage("$0 [args]")
  .command<GeneratePasswordOptions>([generate])
  .help().argv;
