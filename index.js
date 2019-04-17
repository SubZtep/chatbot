var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define("aibot.class", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const dialogflow = require("dialogflow");
    const Discord = require("discord.js");
    const uuidv4 = require("uuid/v4");
    const chalk = require("chalk");
    require("dotenv").config();
    class AIBot {
        constructor() {
            this.dialogConnect();
            this.discordConnect();
        }
        dialogConnect() {
            this.dialogClient = new dialogflow.SessionsClient({
                keyFilename: process.env.KEY_FILE
            });
            this.sessionPath = this.dialogClient.sessionPath(process.env.PROJECT_ID, uuidv4());
        }
        discordConnect() {
            this.discordClient = new Discord.Client();
            this.discordClient.login(process.env.DISCORD_TOKEN);
            this.discordClient.on("ready", () => {
                console.log(`Logged in as ${this.discordClient.user.tag}!`);
                this.botUserId = this.discordClient.user.id;
                this.discordClient
                    .fetchUser(process.env.CHAT_WITH_USER_ID)
                    .then(user => {
                    user.createDM().then(channel => {
                        channel.send("Hi there!");
                    });
                });
            });
            this.discordClient.on("message", message => {
                console.log(chalk.blue(message.author.username), message.content);
                if (message.author.id !== this.botUserId) {
                    this.chat(message.content).then(answer => {
                        message.channel.send(answer);
                    });
                }
            });
        }
        async chat(msg) {
            const request = {
                session: this.sessionPath,
                queryInput: {
                    text: {
                        text: msg,
                        languageCode: process.env.LANGUAGE_CODE
                    }
                }
            };
            const responses = await this.dialogClient.detectIntent(request);
            return responses[0].queryResult.fulfillmentText;
        }
    }
    exports.default = AIBot;
});
define("index", ["require", "exports", "aibot.class"], function (require, exports, aibot_class_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    aibot_class_1 = __importDefault(aibot_class_1);
    const bot = new aibot_class_1.default();
});
