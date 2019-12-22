import {CardPlugin} from "bootstrap-vue";
import {ListWrapper} from "components/lists/list-wrapper";
import download from "downloadjs";
import Api from "modules/Api/Api.module";
import {from} from "rxjs";
import moment from "shared/moment";
import Vue from "vue";
import Component from "vue-class-component";
import WithRender from "./list.layout.html";

Vue.use(CardPlugin);

@WithRender
@Component({components: {ListWrapper}})
export class FormationsList extends Vue {
  public $refs: {
    excelBtn: HTMLElement, table: HTMLElement,
  } = {
    excelBtn: null, table: null,
  };

  public exportExcel() {
    this.$refs.excelBtn.classList.add("loading");
    Api.downloadService.planningXLSX().subscribe((blob: any) => {
      this.$refs.excelBtn.classList.remove("loading");
      download(blob, "PlanningISVin_" + moment().format("Y_MM_DD-HH_mm") + ".xlsx", "application/xlsx");
    });
  }

  public listComponent$ = () =>  from(import(/* webpackChunkName: "admin" */ "./formation.list"));
}
