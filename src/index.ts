import figlet from "figlet"
import chalk from "chalk"
import AIBot, { AIBotConfig } from "./aibot.class"
import dotenv, { DotenvParseOutput } from "dotenv"

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

    const cfg: DotenvParseOutput = dotenv.config().parsed as DotenvParseOutput
    new AIBot((cfg as unknown) as AIBotConfig)
  }
)
