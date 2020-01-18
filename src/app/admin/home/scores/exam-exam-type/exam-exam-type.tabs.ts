import {CardPlugin, TabsPlugin} from "bootstrap-vue";
import {ListWrapper} from "components/lists/list-wrapper";
import {Training} from "modules/Api/Model/Training";
import {from} from "rxjs";
import {Component, Prop, Vue} from "shared/vue";
import WithRender from "./exam-exam-type.tabs.html";

Vue.use(TabsPlugin);
Vue.use(CardPlugin);

@WithRender
@Component({components: {ListWrapper}})
export class ExamExamTypeTabs extends Vue {
  @Prop({default: null})
  public training: Training;
  public examList$ = () =>  from(import(/* webpackChunkName: "admin" */ "./exam.list"));
  public examTypeList$ = () =>  from(import(/* webpackChunkName: "admin" */ "app/_common/lists/exam-type.list"));
}
Vue.component("exam-exam-type-tabs", ExamExamTypeTabs);
