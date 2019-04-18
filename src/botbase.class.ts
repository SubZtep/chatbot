import fs from "fs"
import path from "path"
import chalk from "chalk"
import { createLogger, Logger, format, transports } from "winston"
import AIBotConfig from "./models/aibotconfig"
import Depi from "./depi.class"
import { ZERO } from "long"
import winston = require("winston")
export default abstract class BotBase extends Depi {
  public config!: AIBotConfig
  public logger!: Logger
  protected loadAnimInterval!: NodeJS.Timeout

  constructor(config: AIBotConfig) {
    super()

    // Start loading animation
    this.loadAnimInterval = setInterval(this.loadAnim, 50)

    this.setupLogger()

    // Doublecheck config
    this.parseConfig(config)
      .then(config => {
        this.config = config
        this.startup()
      })
      .catch(err => {
        throw err
      })
  }

  /**
   * Initialise logger
   */
  private setupLogger(): void {
    this.logger = createLogger({
      // level: "info",
      format: format.combine(
        // format.timestamp({
        //   format: "YYYY-MM-DD HH:mm:ss"
        // }),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
      ),
      // defaultMeta: { service: "chatbot" },
      transports: [
        new transports.File({
          filename: path.join(__dirname, "../logs/chatbot-error.log"),
          level: "error"
        }),
        new transports.File({
          filename: path.join(__dirname, "../logs/chatbot-combined.log")
        }),
        new transports.Console({
          format: winston.format.printf(info => info.message)
          // format: format.combine(
          //   format.colorize(),
          //   format.simple(),
          //   format.label({
          //     message: false
          //   })
          //   //format.json({  })
          // )
          //format: format.simple()
        })
      ],
      exitOnError: false
    })
  }

  /**
   * This method called automatically after config setup
   */
  abstract startup(): void

  /**
   * Animation meanwhile the bot logging in
   */
  protected loadAnim(): void {
    let s = ""
    for (let i = 0; i < 10; i++) {
      const n: number = Math.floor(Math.sin(Date.now() / 200 + i / 2) * 4) + 4
      s += String.fromCharCode(0x2581 + n)
    }
    process.stdout.write("\r" + chalk.red(s))
  }

  /**
   * Try to fix invalid config
   * @param config Raw config parameters
   * @returns Proper config
   */
  parseConfig(config: AIBotConfig): Promise<AIBotConfig> {
    return new Promise<AIBotConfig>((resolve, reject) => {
      if (!config.PROJECT_ID) {
        fs.readFile(config.KEY_FILE, (err, data) => {
          if (err) reject(err)
          config.PROJECT_ID = JSON.parse(data.toString())["project_id"]
          resolve(config)
        })
      } else {
        resolve(config)
      }
    })
  }
}
