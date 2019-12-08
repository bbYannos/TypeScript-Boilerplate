import {Component} from "./component";

export abstract class ComponentNjk extends Component {
  protected abstract njk;
  protected data = {};

  public render(data) {
    data = Object.assign(this.data, data);
    const html =  this.njk.render(data);
    super.render(html);
  }
}
