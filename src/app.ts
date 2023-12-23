import * as yargs from 'yargs';
import * as prompts from 'prompts';
import { GeneratePasswordOptions } from './helpers/generatePassword';
import { generatePassword } from './helpers';

yargs
  .scriptName('passgen')
  .usage('$0 <cmd> [args]')
  .command<GeneratePasswordOptions>(
    '$0',
    'Generate a password',
    (yargs) => {
      yargs
        .positional('service', {
          type: 'string',
          describe: 'Service name for password generation',
        })
        .option('secret', {
          type: 'number',
          describe: 'Secret key for password generation',
        });
    },
    async function (argv) {
      try {
        let options: GeneratePasswordOptions;

        // Проверка, переданы ли оба параметра через флаги
        if (argv.service && argv.secret) {
          options = {
            service: argv.service as string,
            secret: argv.secret as number,
          };
        } else if (argv.service) {
          // Если передан только service, запросить secret у пользователя
          const response = await prompts({
            type: 'number',
            name: 'secret',
            message: 'Enter secret key:',
            validate: (value) =>
              typeof value === 'number' ? true : 'Please enter a valid number',
          });

          options = {
            service: argv.service as string,
            secret: response.secret as number,
          };
        } else {
          // Если не передано ни одного параметра, запросить оба у пользователя
          const response = await prompts([
            {
              type: 'text',
              name: 'service',
              message: 'Enter service name:',
            },
            {
              type: 'number',
              name: 'secret',
              message: 'Enter secret key:',
              validate: (value) =>
                typeof value === 'number'
                  ? true
                  : 'Please enter a valid number',
            },
          ]);

          options = {
            service: response.service as string,
            secret: response.secret as number,
          };
        }

        const password = await generatePassword(options);
        console.log(`Generated Password: ${password}`);
      } catch (error) {
        console.error('Error:', error);
      }
    },
  )
  .help().argv;
