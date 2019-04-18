import Dependency from "./models/dependency"

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
  public depi<T>(name: Dependency): T {
    if (this.dependencies.has(name)) {
      return (this.dependencies.get(name) as unknown) as T
    }
    throw new Error(`Dependency ${name} not found.`)
  }
}
