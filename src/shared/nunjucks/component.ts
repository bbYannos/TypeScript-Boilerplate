import {Subject} from "rxjs";

export abstract class Component {
  public $htmEl: HTMLElement;
  protected close_: Subject<void> = new Subject();
  public render(html) {
    if (this.$htmEl) {
      this.$htmEl.innerHTML = html;
    } else {
      console.log("$htmEl undefined", this);
    }
  }

  public find(selector): HTMLElement {
    return this.$htmEl.querySelector(selector);
  }

  public destroy() {
    this.close_.next();
    this.close_.complete();
  }
}
