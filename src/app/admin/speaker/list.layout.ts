import {from} from "rxjs";
import {Component, Vue} from "shared/vue";
import WithRender from "./list.layout.html";

@WithRender
@Component({
  components: {},
})
export class SpeakersList extends Vue {
  public listComponent$ = () =>  from(import(/* webpackChunkName: "admin" */ "./speaker.list"));
}

