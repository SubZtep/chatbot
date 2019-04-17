import fs from "fs"
import path from "path"
import { DMChannel, Attachment, User } from "discord.js"

export default class Commands {
  public picPath!: string
  public channel!: DMChannel
  public user!: User

  /**
   * Set the communication channel
   * @param channel Channel object
   */
  public setChannel(channel: DMChannel): Commands {
    this.channel = channel
    return this
  }

  /**
   * Set partner user
   * @param user Chat with this user
   */
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
    if (this.picPath) {
      const buffer = fs.readFileSync(this.picPath)
      if (buffer) {
        const attachment = new Attachment(buffer, path.basename(this.picPath))
        if (attachment) {
          this.channel.send(attachment)
        }
      }
    }
  }
}
