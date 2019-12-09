import Vue from "vue";
import Component from "vue-class-component";
import WithRender from "./full-page.layout.html";
import {HeaderComponent} from "./header";

@WithRender
@Component({
  components: {HeaderComponent},
})
export class FullPageLayout extends Vue {}
