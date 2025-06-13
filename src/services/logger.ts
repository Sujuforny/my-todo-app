export default class Logger {
    private static currentInstance: Logger;

    constructor() {
        if (Logger.currentInstance) {
            return Logger.currentInstance;
        }

        console.log("Creating new Logger instance");

        Logger.currentInstance = this;
    }

    public static get instance(): Logger {
        if (!Logger.currentInstance) {
            Logger.currentInstance = new Logger();
        }
        return Logger.currentInstance;
    }

    public log(message: any) {
        const prefixLogType = "LOG";
        this.consoleLogger(message, prefixLogType);
    }

    public error(message: any) {
        const prefixLogType = "ERROR";
        this.consoleLogger(message, prefixLogType);
    }

    public info(message: any) {
        const prefixLogType = "INFO";
        this.consoleLogger(message, prefixLogType);
    }

    public warn(message: any) {
        const prefixLogType = "WARN";
        this.consoleLogger(message, prefixLogType);
    }

    private consoleLogger(message: any, prefixString: string) {
        const prefixTimeStamp = "[" + this.getFormattedDate() + "]";
        if (process.env.NEXT_PUBLIC_LOGGER_YN == "Y") {

            switch (prefixString) {
                case "LOG":
                    if (typeof (message) != "object") {
                          process.env.NODE_ENV=="production" ? "" : console.log( prefixTimeStamp + "[" + prefixString +"]" + message );
                    }
                    else {
                          process.env.NODE_ENV=="production" ? "" : console.log( prefixTimeStamp + "[" + prefixString +"]" );
                          process.env.NODE_ENV=="production" ? "" : console.log( message );
                    }
                    break;
                case "INFO":
                    if (typeof (message) != "object") {
                          process.env.NODE_ENV=="production" ? "" : console.log( prefixTimeStamp + "[" + prefixString +"]" + message );
                    }
                    else {
                        process.env.NODE_ENV=="production" ? "" : console.log(prefixTimeStamp + "[" + prefixString + "]");
                        process.env.NODE_ENV=="production" ? "" : console.log(message);
                    }
                    break;
                case "WARN":
                    if (typeof (message) != "object") {
                        process.env.NODE_ENV=="production" ? "" : console.warn(prefixTimeStamp + "[" + prefixString + "]" + message);
                    }
                    else {
                        process.env.NODE_ENV=="production" ? "" : console.warn(prefixTimeStamp + "[" + prefixString + "]");
                        process.env.NODE_ENV=="production" ? "" : console.warn(message);
                    }
                    break;
                case "ERROR":
                    if (typeof (message) != "object") {
                        process.env.NODE_ENV=="production" ? "" : console.error(prefixTimeStamp + "[" + prefixString + "]" + message);
                    }
                    else {
                        process.env.NODE_ENV=="production" ? "" : console.error(prefixTimeStamp + "[" + prefixString + "]");
                        process.env.NODE_ENV=="production" ? "" : console.error(message);
                    }
                    break;
            }
        }
    }

    /**
     * Pads a number with leading zeros to ensure it has the specified length.
     * @param {number} number - The number to pad.
     * @param {number} length - The length to pad to.
     * @returns {string} The padded number as a string.
     */
    private pad(number: number, length: number) {
        return String(number).padStart(length, "0");
    }

    /**
     * Formats the current date and time as 'YYYY-MM-DD HH:mm:ss.SSS'.
     * @returns {string} The formatted date and time.
     */
    private getFormattedDate() {
        const now = new Date();
        const year = now.getFullYear();
        const month = this.pad(now.getMonth() + 1, 2); // Months are zero-based, so add 1
        const day = this.pad(now.getDate(), 2);
        const hours = this.pad(now.getHours(), 2);
        const minutes = this.pad(now.getMinutes(), 2);
        const seconds = this.pad(now.getSeconds(), 2);
        const milliseconds = this.pad(now.getMilliseconds(), 3);
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
    }
}
