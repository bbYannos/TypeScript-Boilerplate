import "datatables.net";
import $ from "jquery";
import {Observable, Subscription} from "rxjs";
import {debounceTime, takeUntil, tap} from "rxjs/operators";
import {language} from "../Constants";
import {Cell} from "./Cell";
import {Column} from "./Column";
import {ColumnsCollection} from "./Columns.Colletion";

export class DataTableBase<T> {
  public close$: Observable<void> = null;
  public $htmEl: HTMLElement = null;

  public cssClasses = "table table-striped ";
  public overrideOptions: DataTables.Settings = {};
  protected options: DataTables.Settings = {
    info: false,
    autoWidth: false,
    responsive: false,
    paging: false,
    searching: false,
    columns: [],
    order: [],
  };

  protected columnsCollection: ColumnsCollection;

  protected _dataSource$ub: Subscription = null;
  protected dataTableApi: DataTables.Api = null;
  protected $table: JQuery<HTMLElement>;
  protected currentPage: number = null;

  public setDataSource$(dataSource$: Observable<T[]>) {
    if (this._dataSource$ub !== null) {
      this._dataSource$ub.unsubscribe();
      // alert("SET DATA SOURCE$ MULTIPLE TIMES");
    }
    this._dataSource$ub = this.prepareDataSource$(dataSource$).subscribe(() => {
      // console.log('Redraw Table' + this.constructorName);
    });
  }

  public set columns(columns: Column[]) {
    this.columnsCollection = new ColumnsCollection(columns);
  }

  protected initDataTable() {
    this.$htmEl.innerHTML = '<table class="' + this.cssClasses + '" width="100%"></table>';
    this.$table = $(this.$htmEl).find(" > table");
    if (this.$table) {
      this.options = {...this.options, ...this.overrideOptions};
      this.options.columns = this.columnsCollection.columns.map((column: Column) => column.display);
      this.options.language = language.fr;
      this.$table.addClass("display");
      this.dataTableApi = this.$table.DataTable(this.options);
      this.columnsCollection.dataTableApi = this.dataTableApi;
      this.$table.on("page.dt", () => {
        this.currentPage = this.dataTableApi.page.info().page;
      });
      this.$table.on("click", "td", this.manageClickOnCells);
    } else {
      console.log("Failed initDataTable");
      console.log(this.$htmEl, this.$table);
    }
  }

  protected prepareDataSource$(dataSource$: Observable<T[]>) {
    return dataSource$.pipe(
      debounceTime(0),
      takeUntil(this.close$),
      tap((objects: T[]) => {
        // console.log('From data Source', objects);
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

  protected clickToCell(click: JQuery.ClickEvent) {
    const $cell = $(click.currentTarget as HTMLElement);
    return new Cell($cell, this.dataTableApi);
  }

  protected manageCellClick(cell: Cell) {
    return;
  }

  protected manageClickOnCells = (click: JQuery.ClickEvent) => {
    if (click.currentTarget.classList.contains("dataTables_empty")) {
      return null;
    }
    const cellClick = this.clickToCell(click);
    if (cellClick !== null) {
      this.manageCellClick(cellClick);
    }
  };
}
