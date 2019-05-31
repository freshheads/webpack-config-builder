import chalk from 'chalk';

export const warn = (message: string): void => {
    console.warn(chalk.bold.hex('#000').bgYellow(message));
};

export const error = (message: string): void => {
    console.error(chalk.bold.hex('#fff').bgRed(message));
};
