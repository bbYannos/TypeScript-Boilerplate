import {Observable} from "rxjs";
import {tap} from "rxjs/operators";
import {AbstractExpandableContent} from "../AbstractExpandableContent";
import {Cell} from "./Cell";
import {DataTableBase} from "./DataTable.Base";

export class DataTableExpandable<T> extends DataTableBase<T> {

  protected expandable: AbstractExpandableContent = null;

  public showAll() {
    this.dataTableApi.columns().search("").draw(false);
    this.$htmEl.classList.remove("single");
    this.dataTableApi.rows().eq(0).each((index) => {
      if (this.expandable !== null) {
        if (this.dataTableApi.rows().count() < 5) {
          this.showExpandable(Cell.fromRowIndex(index, this.dataTableApi));
        } else {
          this.hideExpandable(Cell.fromRowIndex(index, this.dataTableApi));
        }
      }
    });
  }

  protected manageCellClick(cell: Cell) {
    if (cell.name === "expandable") {
      this.toggleExpandable(cell);
    }
  }

  protected prepareDataSource$(dataSource$: Observable<T[]>): Observable<T[]> {
    return super.prepareDataSource$(dataSource$).pipe(tap(() => this.showAll()));
  }

  protected toggleExpandable(cell: Cell) {
    if (cell.row.child.isShown()) {
      this.hideExpandable(cell);
    } else {
      this.showExpandable(cell);
    }
  }

  protected showExpandable(cell: Cell) {
    if (cell.row.child() === undefined) {
      const expandable = this.expandable.getInstance();
      expandable.content$.subscribe((content) => {
        cell.row.child(content);
        this.afterInjectExpandableContent(cell);
      });
      expandable.render(cell.object as any);
    }
    cell.$tr.find(".fa-chevron-right").removeClass("fa-chevron-right").addClass("fa-chevron-down");
    cell.$tr.addClass("shown");
    cell.row.child.show();
  }

  // noinspection TypescriptExplicitMemberType,JSUnusedLocalSymbols
  protected afterInjectExpandableContent(cell: Cell) {
    // tslint:disable-next-line
  }

  // noinspection JSMethodCanBeStatic
  protected hideExpandable(cell: Cell) {
    cell.$tr.find(".fa-chevron-down").removeClass("fa-chevron-down").addClass("fa-chevron-right");
    cell.$tr.removeClass("shown");
    cell.row.child.hide();
  }
}
