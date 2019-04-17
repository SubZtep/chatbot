import fs from "fs"
import path from "path"
import { DMChannel, Attachment, User } from "discord.js"

export default class Commands {
  public picPath!: string
  public channel!: DMChannel
  public user!: User

  public setChannel(channel: DMChannel): Commands {
    this.channel = channel
    return this
  }

  public setUser(user: User): Commands {
    this.user = user
    return this
  }

  /**
   * Run special bot commands. All commands starts with ! mark
   *
   * !die - shut down bot
   *
   * @param msg User entered message
   * @return Was message a command?
   */
  public run(msg: string): boolean {
    if (msg.charAt(0) === "!") {
      switch (msg.substring(1)) {
        case "die":
          this.cmdDie()
          break
        case "pic":
          this.cmdPic()
          break
        default:
          return false
      }
      return true
    }
    return false
  }

  public cmdDie() {
    process.exit()
  }

  public cmdPic() {
    const buffer = fs.readFileSync(this.picPath)
    const attachment = new Attachment(buffer, path.basename(this.picPath))
    this.channel.send(attachment)
  }
}
