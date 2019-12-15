import {CardComponent} from "components/card";
import download from "downloadjs";
import Api from "modules/Api/Api.module";
import moment from "shared/moment";
import Vue from "vue";
import Component from "vue-class-component";
import WithRender from "./list.layout.html";

@WithRender
@Component({components: {CardComponent}})
export class FormationsList extends Vue {

  public $refs: {
    excelBtn: HTMLElement,
  } = {excelBtn: null};

  public exportExcel() {
    this.$refs.excelBtn.classList.add("loading");
    Api.downloadService.planningXLSX().subscribe((blob: any) => {
      this.$refs.excelBtn.classList.remove("loading");
      download(blob, "PlanningISVin_" + moment().format("Y_MM_DD-HH_mm") + ".xlsx", "application/xlsx");
    });
  }
}
