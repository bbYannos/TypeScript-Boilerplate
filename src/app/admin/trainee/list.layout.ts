import Vue from "vue";
import Component from "vue-class-component";
import WithRender from "./list.layout.html";

@WithRender
@Component({
  components: {},
})
export class TraineesList extends Vue {}
