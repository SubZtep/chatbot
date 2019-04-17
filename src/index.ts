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
    const cfg: DotenvParseOutput = dotenv.config().parsed as DotenvParseOutput
    let bot = new AIBot((cfg as unknown) as AIBotConfig)

    // Init dependencies
    const cmds = new Commands()
    cmds.picPath = path.join(__dirname, "../assets/pictures/sonia_oobt.jpg")

    // Add dependencies
    bot.addDepi(Dependency.Command, cmds)
  }
)
