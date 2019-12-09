import Vue from "vue";
import Component from "vue-class-component";
import {Prop} from "vue-property-decorator";
import WithRender from "./message.html";

export type alertType = ("success" | "warning" | "danger");

@WithRender
@Component
export class MessageComponent extends Vue {
  @Prop({default: null})
  public data: { type: alertType, label: string, detail: string };
}

export default Vue.component("message-c", MessageComponent);
