import Vue from "vue";
import Component from "vue-class-component";
import WithRender from "./list.layout.html";

@WithRender
@Component({
  components: {},
})
export class SpeakersLayout extends Vue {
}
export default Vue.component("speakers-layout", SpeakersLayout);
