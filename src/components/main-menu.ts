import BootstrapVue, {CollapsePlugin} from "bootstrap-vue";
import Vue from "vue";
import Component from "vue-class-component";
import {Prop} from "vue-property-decorator";
import WithRender from "./main-menu.html";

Vue.use(BootstrapVue);

@WithRender
@Component({components: CollapsePlugin})
export class MainMenu extends Vue {
  @Prop({default: []})
  public routes;

  public created() {
    this.routes.forEach((_route) => {
      if (!_route.meta) {
        _route.meta = {};
      }
    });
  }

  public match(route): boolean {
    return this.$route.matched.filter((_route) => _route.path === route.path).length > 0;
  }

  public routeApiChildren(route): boolean {
    if (!route.children) {
      return;
    }
    const routeWithApiChildren = route.children.find((_route) => _route.meta && _route.meta.elements && _route.meta.elements.length > 0);
    if (! routeWithApiChildren) {
      return;
    }
    return routeWithApiChildren.meta.elements;
  }
}

export default Vue.component("main-menu", MainMenu);
