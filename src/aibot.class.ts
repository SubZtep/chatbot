import { SessionsClient, DetectIntentRequest } from "dialogflow"

//import { SessionsClient, DetectIntentRequest } from "dialogflow"
import { Client } from "discord.js"

const dialogflow = require("dialogflow")
const Discord = require("discord.js")
const uuidv4 = require("uuid/v4")
const chalk = require("chalk")
require("dotenv").config()

export default class AIBot {
  private sessionPath!: string
  private botUserId!: string
  private discordClient!: Client
  private dialogClient!: SessionsClient

  constructor() {
    this.dialogConnect()
    this.discordConnect()
  }

  private dialogConnect(): void {
    this.dialogClient = new dialogflow.SessionsClient({
      keyFilename: process.env.KEY_FILE
    })
    this.sessionPath = this.dialogClient.sessionPath(
      process.env.PROJECT_ID as string,
      uuidv4()
    )
  }

  private discordConnect(): void {
    this.discordClient = new Discord.Client()
    this.discordClient.login(process.env.DISCORD_TOKEN)

    this.discordClient.on("ready", async () => {
      console.log(`Logged in as ${this.discordClient.user.tag}!`)
      this.botUserId = this.discordClient.user.id
      try {
        const user = await this.discordClient.fetchUser(process.env
          .CHAT_WITH_USER_ID as string)
        const channel = await user.createDM()
        channel.send("Hi there!")
      } catch (err) {
        console.log("ERROR", err)
      }
    })

    this.discordClient.on("message", async message => {
      console.log(chalk.blue(message.author.username), message.content)
      if (message.author.id !== this.botUserId) {
        try {
          const answer = await this.chat(message.content)
          message.channel.send(answer)
        } catch (err) {
          message.channel.send("_sigh_")
          console.log("ERROR", err)
        }
      }
    })
  }

  protected async chat(msg: string): Promise<string> {
    const request: DetectIntentRequest = {
      session: this.sessionPath,
      queryInput: {
        text: {
          text: msg,
          languageCode: process.env.LANGUAGE_CODE as string
        }
      }
    }
    const responses = await this.dialogClient.detectIntent(request)
    if (!responses[0].queryResult.fulfillmentText) {
      throw new Error("No response")
    }
    return responses[0].queryResult.fulfillmentText
  }
}
