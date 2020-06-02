const chalk = require('chalk')

export class Log {
    static info(message: string) {
        console.log(chalk.green(`[INFO] ${message}`))
    }

    static error(message: any) {
        console.log(chalk.red(`[INFO] ${message}`))
    }
}