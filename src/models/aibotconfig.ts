/**
 * Configuration `.env` schema
 */
export default interface AIBotConfig {
  DISCORD_TOKEN: string
  PROJECT_ID: string
  KEY_FILE: string
  PIC_FILE?: string
  CHAT_WITH_USER_ID: string
}
