import fs from "fs"
import chalk from "chalk"
import AIBotConfig from "./models/aibotconfig"
import Depi from "./depi.class"
export default abstract class BotBase extends Depi {
  protected config!: AIBotConfig
  protected loadAnimInterval!: NodeJS.Timeout

  constructor(config: AIBotConfig) {
    super()

    this.loadAnimInterval = setInterval(this.loadAnim, 50)
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
   *
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
