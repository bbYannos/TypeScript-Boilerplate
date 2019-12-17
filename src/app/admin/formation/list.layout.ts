import {CardComponent} from "components/card";
import download from "downloadjs";
import Api from "modules/Api/Api.module";
import {from, Subject, timer} from "rxjs";
import {switchMap} from "rxjs/operators";
import moment from "shared/moment";
import Vue from "vue";
import Component from "vue-class-component";
import WithRender from "./list.layout.html";


@WithRender
@Component({components: {CardComponent}})
export class FormationsList extends Vue {
  public $refs: {
    excelBtn: HTMLElement,
    table: HTMLElement,
  } = {excelBtn: null, table: null};

  protected close_: Subject<void> = new Subject<void>();

  public exportExcel() {
    this.$refs.excelBtn.classList.add("loading");
    Api.downloadService.planningXLSX().subscribe((blob: any) => {
      this.$refs.excelBtn.classList.remove("loading");
      download(blob, "PlanningISVin_" + moment().format("Y_MM_DD-HH_mm") + ".xlsx", "application/xlsx");
    });
  }

  public listComponent$ = () => timer(0).pipe(
    switchMap(() => from(import(/* webpackChunkName: "admin" */ "./list"))),
  );
  public mounted() {
    this.listComponent$().subscribe((module) => {
      const ListComponent = module.default.ListComponent;
      const list = new ListComponent();
      list.$htmlEl = this.$refs.table;
      list.close$ = this.close_.asObservable();
      list.render();
    });
  }

  // noinspection JSUnusedGlobalSymbols
  public beforeDestroy() {
    this.close_.next();
    this.close_.complete();
  }
}
