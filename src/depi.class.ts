import Dependency from "./models/dependency"
import Commands from "./commands.class"

export default abstract class Depi {
  private dependencies: Map<string, object> = new Map<string, object>()

  constructor() {}

  /**
   * Add new dependency
   *
   * @param name
   * @param obj
   */
  public addDepi(name: Dependency, obj: object): void {
    if (!this.dependencies.has(name)) {
      this.dependencies.set(name, obj)
    }
  }

  /**
   * Get a dependency instance
   *
   * @param name Dependency name
   * @returns Dependency
   */
  public depi(name: Dependency): any | undefined {
    if (this.dependencies.has(name)) {
      return this.dependencies.get(name) as Commands
    }
    return undefined
  }
}
