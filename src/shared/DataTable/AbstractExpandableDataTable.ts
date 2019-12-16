import {Observable} from "rxjs";
import {tap} from "rxjs/operators";
import {AbstractDataTable, CellClick} from "./AbstractDataTable";

export abstract class AbstractExpandableDataTable<T> extends AbstractDataTable<T> {

  public showAll() {
    this.dataTableApi.columns().search("").draw(false);
    this.$htmEl.classList.remove("single");
    this.dataTableApi.rows().eq(0).each((index) => {
      if (this.expandable !== null) {
        if (this.dataTableApi.rows().count() < 5) {
          this.showExpandable(CellClick.fromRowIndex(index, this.dataTableApi));
        } else {
          this.hideExpandable(CellClick.fromRowIndex(index, this.dataTableApi));
        }
      }
    });
  }

  protected manageCellClick(cellClick: CellClick) {
    if (cellClick.name === "expandable") {
      this.toggleExpandable(cellClick);
    }
  }

  protected prepareDataSource$(dataSource$: Observable<T[]>): Observable<T[]> {
    return super.prepareDataSource$(dataSource$).pipe(tap(() => this.showAll()));
  }

  protected toggleExpandable(cellClick: CellClick) {
    if (cellClick.row.child.isShown()) {
      this.hideExpandable(cellClick);
    } else {
      this.showExpandable(cellClick);
    }
  }

  protected showExpandable(cellClick: CellClick) {
    if (cellClick.row.child() === undefined) {
      const expandable = this.expandable.getInstance();
      expandable.content$.subscribe((content) => {
        cellClick.row.child(content);
        this.afterInjectExpandableContent(cellClick);
      });
      expandable.render(cellClick.object as any);
    }
    cellClick.$tr.find(".fa-chevron-right").removeClass("fa-chevron-right").addClass("fa-chevron-down");
    cellClick.$tr.addClass("shown");
    cellClick.row.child.show();
  }

  // noinspection TypescriptExplicitMemberType,JSUnusedLocalSymbols
  protected afterInjectExpandableContent(cellClick: CellClick) {
    // tslint:disable-next-line
  }

  // noinspection JSMethodCanBeStatic
  protected hideExpandable(cellClick) {
    cellClick.$tr.find(".fa-chevron-down").removeClass("fa-chevron-down").addClass("fa-chevron-right");
    cellClick.$tr.removeClass("shown");
    cellClick.row.child.hide();
  }
}
