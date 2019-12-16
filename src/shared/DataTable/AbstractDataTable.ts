import "datatables.net";
import "jquery";
import {Observable, Subscription} from "rxjs";
import {debounceTime, takeUntil, tap} from "rxjs/operators";
import {ObjectUtils} from "shared/utils/object.utils";
import {AbstractExpandableContent} from "./AbstractExpandableContent";
import {CellClick} from "./CellClick.Base";
import {language} from "./Constants";
import "./dataTable.css";

export {CellClick};

export abstract class AbstractDataTable<T> {
  public close$: Observable<void> = null;
  public $htmEl: HTMLElement = null;
  public cssClasses = "table table-striped ";
  protected options: DataTables.Settings = {
    info: false,
    autoWidth: false,
    responsive: false,
    paging: false,
    searching: false,
    columns: [],
    order: [],
  };
  protected abstract overrideOptions: DataTables.Settings;
  protected _dataSource$ub: Subscription = null;
  protected dataTableApi: DataTables.Api = null;
  protected $table: JQuery<HTMLElement>;
  protected expandable: AbstractExpandableContent = null;
  protected currentPage: number = null;

  public setDataSource$(dataSource$: Observable<T[]>) {
    if (this._dataSource$ub !== null) {
      this._dataSource$ub.unsubscribe();
      alert("SET DATA SOURCE$ MULTIPLE TIMES");
    }
    this._dataSource$ub = this.prepareDataSource$(dataSource$).subscribe(() => {
      // console.log('Redraw Table' + this.constructorName);
    });
  }

  protected prepareDataSource$(dataSource$: Observable<T[]>) {
    return dataSource$.pipe(
      debounceTime(100),
      takeUntil(this.close$),
      tap((objects: T[]) => {
        // console.log('From data SOurce', objects);
        if (this.dataTableApi === null) {
          this.initDataTable();
        }
        this.dataTableApi.clear();
        this.dataTableApi.rows.add(objects);
        this.dataTableApi.draw();
        if (this.currentPage !== null) {
          this.dataTableApi.page(this.currentPage).draw(false);
        }
      }),
    );
  }

  protected initDataTable() {
    this.$htmEl.innerHTML = '<table class="' + this.cssClasses + '" width="100%"></table>';
    this.$table = $(this.$htmEl.querySelector(" > table")) as JQuery<HTMLElement>;
    if (this.$table) {
      this.options = {...this.options, ...this.overrideOptions};
      this.options.language = language.fr;
      this.$htmEl.classList.remove("_to-show");
      this.$table.addClass("display");
      /* moment columns sorting **/
      $.fn.dataTable.ext.order["dom-moment"] = function(settings, col) {
        return this.api().column(col, {order: "index"}).nodes().map((td: HTMLTableCellElement) => {
          if (ObjectUtils.isValidMoment(this.api().cell(td).data())) {
            return this.api().cell(td).data().format();
          } else {
            return null;
          }
        });
      };
      this.dataTableApi = this.$table.DataTable(this.options);
      this.$table.on("page.dt", () => {
        this.currentPage = this.dataTableApi.page.info().page;
      });
      this.$table.on("click", "td", this.manageClickOnCells);
    } else {
      console.log("Failed initDataTable");
      console.log(this.$htmEl, this.$table);
    }
  }

  protected clickToCellClick(click: JQuery.ClickEvent) {
    const $cell = $(click.currentTarget as HTMLElement);
    return new CellClick($cell, this.dataTableApi);
  }

  protected abstract manageCellClick(cellClick: CellClick);

  protected manageClickOnCells = (click: JQuery.ClickEvent) => {
    if (click.currentTarget.classList.contains("dataTables_empty")) {
      return null;
    }
    const cellClick = this.clickToCellClick(click);
    if (cellClick !== null) {
      this.manageCellClick(cellClick);
    }
  };
}
