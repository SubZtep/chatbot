# Chatbot :tongue:

Discord chatbot using Dialogflow agent.
After the start, it sends a message to the configured user.
Only one-to-one DM is possible at the moment.

## Setup

1. Install [NodeJS](https://nodejs.org/) and [Yarn](http://yarnpkg.com/).
2. [Create](https://console.dialogflow.com/api-client) **Dialogflow agent**.
3. Create key and save JSON config from Service Account to `assets/dialogflow/filename.json`.
4. [Create](https://discordapp.com/developers/applications/) **Discord BOT** and [add to a server](https://discordjs.guide/preparations/adding-your-bot-to-servers.html#bot-invite-links) if you wish.
5. Clone (or download) repository.
6. Run `yarn install` for download dependencies.
7. Create `.env` file:
   ```bash
   DISCORD_TOKEN="XXX6TESTTESTTESTTEST9XXX"
   LANGUAGE_CODE="en"
   KEY_FILE="./assets/dialogflow/small-talk-1-xyz-example.json"
   PIC_FILE="./assets/pictures/test.jpg"
   CHAT_WITH_USER_ID="123456789012345678"
   ```
8. Run `yarn build` for build project.
9. Run `yarn start` for start BOT.

## BOT Commands

| Chat Message | Description    |
| ------------ | -------------- |
| `!die`       | Kill BOT       |
| `!pic`       | Send a picture |

## License

MIT
