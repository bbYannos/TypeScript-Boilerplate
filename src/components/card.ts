import Vue from "vue";
import Component from "vue-class-component";
import {Prop} from "vue-property-decorator";
import WithRender from "./card.html";

@WithRender
@Component
export class CardComponent extends Vue {
  @Prop({default: {label: "", loading: false}})
  public data: {label: string, loading: boolean};
}
export default Vue.component("card-c", CardComponent);
