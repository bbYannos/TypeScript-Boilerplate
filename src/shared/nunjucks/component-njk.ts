import {Component} from "./component";

export abstract class ComponentNjk extends Component {
  protected abstract njk;
  protected data = {};

  public render(data) {
    data = {...this.data, ...data};
    const html =  this.njk.render(data);
    super.render(html);
  }
}
