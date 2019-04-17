import path from "path"
import dotenv, { DotenvParseOutput } from "dotenv"
import figlet from "figlet"
import chalk from "chalk"
import Commands from "./commands.class"
import AIBot from "./aibot.class"
import AIBotConfig from "./models/aibotconfig"
import Dependency from "./models/dependency"

figlet(
  "Sonia_ooBT",
  {
    font: "Efti Robot",
    horizontalLayout: "fitted"
  },
  (err, data) => {
    if (err) {
      console.log("Something went wrong...", err)
      process.exit(1)
    }

    // Show logo
    console.log(chalk.bgBlack.red(data as string))

    // Init AIBot
    const rawConfig: DotenvParseOutput = dotenv.config().parsed as DotenvParseOutput
    const config = (rawConfig as unknown) as AIBotConfig
    let bot = new AIBot(config)

    // Init dependencies
    const cmds = new Commands()
    if (config.PIC_FILE) {
      cmds.picPath = path.join(__dirname, "../", config.PIC_FILE)
    }

    // Add dependencies
    bot.addDepi(Dependency.Command, cmds)
  }
)
