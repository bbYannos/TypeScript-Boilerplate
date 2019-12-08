export abstract class Component {
  public $htmEl: HTMLElement;

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
}
