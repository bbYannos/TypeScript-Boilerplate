export class Debuggable {
  public debug: boolean = false;

  protected log(...param) {
    if (this.debug) {
      console.log(...param);
    }
  }
}
