export class CellClick {
  constructor(
    public $td: JQuery,
    protected dataTableApi: any,
  ) {
  }

  public get value() {
    return this.cell.data();
  }

  public get cell() {
    return this.dataTableApi.cell(this.$td);
  }

  public get name(): string {
    if (this.dataTableApi.settings().init().columns !== undefined) {
      return this.dataTableApi.settings().init().columns[this.colIndex].name;
    }
    return "";
  }

  public get $tr(): JQuery {
    return this.$td.closest("tr");
  }

  public get row(): DataTables.RowMethods {
    return this.dataTableApi.row(this.$tr);
  }

  public get object(): any {
    return this.row.data();
  }

  public get pageNum(): number {
    if (this.dataTableApi.page.info().length === -1) {
      return null;
    }
    return Math.floor(this.rowIndex / this.dataTableApi.page.info().length);
  }

  public get rowIndex(): number {
    return this.dataTableApi.rows({order: "applied"}).nodes().indexOf(this.$tr.get(0));
  }

  public get colIndex(): number {
    return this.dataTableApi.cell(this.$td).index().column;
  }

  public get column() {
    return this.dataTableApi.column(this.colIndex);
  }

  public get property(): string {
    return this.column.dataSrc().toString();
  }

  public get readOnly(): boolean {
    return (this.object.readOnly === true);
  }

  public static fromRowIndex(index: number, dataTableApi): CellClick {
    const $row = this.get$RowAtIndex(index, dataTableApi);
    const $td = $row.find(" > td:first-child");
    return new CellClick($td, dataTableApi);
  }

  public static fromRowAndColIndexes(rowIndex: number, colIndex: number, dataTableApi) {
    const $row = this.get$RowAtIndex(rowIndex, dataTableApi);
    const $td = $row.find(" > td").toArray()[colIndex];
    return new CellClick($td, dataTableApi);
  }

  public static get$RowAtIndex(index: number, dataTableApi) {
    return $(dataTableApi.rows({order: "applied"}).nodes()[index]);
  }
}
