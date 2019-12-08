import {ComponentNjk} from "./component-njk";

export class LayoutData {
    public firstRender: boolean;
    public dynamicContentSelector: string;
}
// tslint:disable-next-line
export abstract class Layout extends ComponentNjk {
    protected $dynamicContentWrapper: HTMLElement;
    public data = {
        loading: false,
        firstRender: true,
        dynamicContentSelector: "#dynamicContent",
    };

    public render(data = {}) {
        data = {...this.data, ...data};
        const html = this.njk.render(this.data);
        if (this.data.firstRender) {
            this.$htmEl.innerHTML = html;
            this.$dynamicContentWrapper = this.$htmEl.querySelector(this.data.dynamicContentSelector);
            this.data.firstRender = false;
        } else {
            this.$dynamicContentWrapper.innerHTML = html;
        }
    }
}
