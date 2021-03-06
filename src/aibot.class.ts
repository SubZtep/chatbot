import dialogflow, { SessionsClient, DetectIntentRequest } from "dialogflow"
import Discord, { Client, User, DMChannel } from "discord.js"
import uuidv1 from "uuid"
import chalk from "chalk"
import BotBase from "./botbase.class"
import { rand } from "./utils"
import AIBotConfig from "./models/aibotconfig"
import Dependency from "./models/dependency"
import Commands from "./commands.class"

export default class AIBot extends BotBase {
  public welcomeMessage: string = "Hi there!"
  private sessionPath!: string
  private botUserId!: string
  private discordClient!: Client
  private dialogflowClient!: SessionsClient

  constructor(config: AIBotConfig) {
    super(config)
  }

  startup(): void {
    this.dialogflowConnect()
    this.discordConnect()
  }

  /**
   * Connect to Dialogflow
   */
  private dialogflowConnect(): void {
    this.dialogflowClient = new dialogflow.SessionsClient({
      keyFilename: this.config.KEY_FILE
    })
    this.sessionPath = this.dialogflowClient.sessionPath(this.config.PROJECT_ID as string, uuidv1())
  }

  /**
   * Connect to Discord and set up event handlers
   */
  private discordConnect() {
    this.discordClient = new Discord.Client()
    this.discordClient.login(this.config.DISCORD_TOKEN)

    // Connected to Discord
    this.discordClient.on("ready", async () => {
      this.botUserId = this.discordClient.user.id
      clearInterval(this.loadAnimInterval)
      this.logger.info(chalk.red.inverse(`\rLogged in as ${this.discordClient.user.tag}!`))
      try {
        const user: User = await this.discordClient.fetchUser(this.config.CHAT_WITH_USER_ID)
        const channel: DMChannel = await user.createDM()
        channel.send(this.welcomeMessage)
        this.depi<Commands>(Dependency.Command)
          .setChannel(channel)
          .setUser(user)
      } catch (err) {
        throw err
      }
    })

    // Received a new message
    this.discordClient.on("message", async (message: any) => {
      if (this.depi<Commands>(Dependency.Command).run(message.content)) return

      // Print last message
      this.logger.info("%s %s", chalk.reset.magenta(message.author.username), message.content)

      // If last message is from user try to answer
      if (message.author.id !== this.botUserId) {
        let answer: string
        try {
          answer = await this.getAnswer(message.content)
        } catch (err) {
          answer = "_sigh..._"
        }

        this.writeAnswer(answer, message.channel as DMChannel)
      }
    })
  }

  /**
   * Writing answer with delays to copy human behaviour
   * @param answer Answer text
   */
  writeAnswer(answer: string, channel: DMChannel): void {
    setTimeout(() => {
      channel.startTyping()
      setTimeout(() => {
        channel.stopTyping()
        channel.send(answer)
      }, rand(3) * 1000)
    }, rand(3, 0) * 500)
  }

  /**
   * Try to get reply message to user
   * @param msg
   * @returns Reply message
   */
  protected async getAnswer(msg: string): Promise<string> {
    const request: DetectIntentRequest = {
      session: this.sessionPath,
      queryInput: {
        text: {
          text: msg,
          languageCode: "en"
        }
      }
    }
    const responses = await this.dialogflowClient.detectIntent(request)
    if (!responses[0].queryResult.fulfillmentText) {
      throw "No response"
    }
    return responses[0].queryResult.fulfillmentText
  }
}
