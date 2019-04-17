import dialogflow, { SessionsClient, DetectIntentRequest } from "dialogflow"
import Discord, { Client, User, DMChannel } from "discord.js"
import fs from "fs"
import uuidv4 from "uuid"
import chalk from "chalk"

export interface AIBotConfig {
  DISCORD_TOKEN: string
  LANGUAGE_CODE: string
  PROJECT_ID: string
  KEY_FILE: string
  CHAT_WITH_USER_ID: string
}

export default class AIBot {
  private config!: AIBotConfig
  private sessionPath!: string
  private botUserId!: string
  private discordClient!: Client
  private dialogClient!: SessionsClient
  private loopInterval!: NodeJS.Timeout

  constructor(config: AIBotConfig) {
    this.loopInterval = setInterval(this.loop, 50)
    this.parseConfig(config)
      .then(config => {
        this.config = config
        this.dialogConnect()
        this.discordConnect()
      })
      .catch(err => {
        throw err
      })
  }

  /**
   * Animation meanwhile the bot logging in
   */
  private loop(): void {
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

  /**
   * Connect to Dialoglow
   */
  private dialogConnect(): void {
    this.dialogClient = new dialogflow.SessionsClient({
      keyFilename: this.config.KEY_FILE
    })
    this.sessionPath = this.dialogClient.sessionPath(this.config.PROJECT_ID as string, uuidv4())
  }

  /**
   * Connect to Discord and set up event handlers
   */
  private async discordConnect() {
    this.discordClient = new Discord.Client()
    this.discordClient.login(this.config.DISCORD_TOKEN)

    this.discordClient.on("ready", async () => {
      this.botUserId = this.discordClient.user.id
      clearInterval(this.loopInterval)
      console.log(chalk.red.inverse(`\rLogged in as ${this.discordClient.user.tag}!`))
      try {
        const user: User = await this.discordClient.fetchUser(this.config.CHAT_WITH_USER_ID)
        const channel: DMChannel = await user.createDM()
        channel.send("Hi there!")
      } catch (err) {
        throw err
      }
    })

    this.discordClient.on("message", async message => {
      if (this.runCommands(message.content)) return

      // Print last message
      console.log(chalk.reset.magenta(message.author.username), message.content)

      // If last message is from user try to answer
      if (message.author.id !== this.botUserId) {
        try {
          const answer = await this.chat(message.content)
          message.channel.send(answer)
        } catch (err) {
          message.channel.send("_sigh..._")
        }
      }
    })
  }

  /**
   * Run special bot commands. All commands starts with ! mark
   *
   * !die - shut down bot
   *
   * @param msg User entered message
   * @return Was message a command?
   */
  private runCommands(msg: string): boolean {
    if (msg.charAt(0) === "!") {
      const cmd = msg.substring(1)
      if (cmd === "die") {
        process.exit()
      }
      return true
    }
    return false
  }

  /**
   * Try to get reply message to user
   *
   * @param msg
   * @returns Reply message
   */
  protected async chat(msg: string): Promise<string> {
    const request: DetectIntentRequest = {
      session: this.sessionPath,
      queryInput: {
        text: {
          text: msg,
          languageCode: this.config.LANGUAGE_CODE
        }
      }
    }
    const responses = await this.dialogClient.detectIntent(request)
    if (!responses[0].queryResult.fulfillmentText) {
      throw "No response"
    }
    return responses[0].queryResult.fulfillmentText
  }
}
