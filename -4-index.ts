//// <reference path="node_modules/@types/dialogflow/index.d.ts" />
//// <reference path="node_modules/discord.js/typings/index.d.ts" />
import {
  SessionsClient,
  DetectIntentResponse,
  DetectIntentRequest
} from "dialogflow"

const readlineSync = require("readline-sync")
const dialogflow = require("dialogflow")
const Discord = require("discord.js")

const chatWithUserId = "269046908146810881"
const botUserId = "568028645914837005"

const discordToken =
  "NTY4MDI4NjQ1OTE0ODM3MDA1.XLcICw.izohS-cO69DPPeFi9J-3aXcImHo"
const projectId = "jokes-ad7b4"
const sessionId = "1"
const languageCode = "en"
const sessionClient: SessionsClient = new dialogflow.SessionsClient({
  keyFilename: "./jokes-ad7b4-d6b277a4558d.json"
})

const client = new Discord.Client()
client.login(discordToken)

const sessionPath: string = sessionClient.sessionPath(projectId, sessionId)
let promise: Promise<DetectIntentResponse[]>

async function chat(msg: string): Promise<string> {
  console.log("CHAT", msg)
  const request: DetectIntentRequest = {
    session: sessionPath,
    queryInput: {
      text: {
        text: msg,
        languageCode: languageCode
      }
    }
  }
  const responses = await sessionClient.detectIntent(request)
  return responses[0].queryResult.fulfillmentText
}

async function main() {
  while (true) {
    const query: string = readlineSync.question("YOU: ")

    console.log("1")
    const answer = await chat(query)
    console.log("2")

    console.log("BOT", answer)
  }
}

//main()

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
  client.fetchUser(chatWithUserId).then(user => {
    user.createDM().then(channel => {
      channel.send("Hi there!")
    })
  })
})

client.on("message", message => {
  //console.log("MSG", message.author.id)
  if (message.author.id !== botUserId) {
    chat(message.content).then(answer => {
      message.channel.send(answer)
    })
  }
})

console.log("a")
//while (true) {}

//main()
