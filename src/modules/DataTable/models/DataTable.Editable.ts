import $ from "jquery";
import {Observable, Subject, Subscription, timer} from "rxjs";
import {takeUntil, tap} from "rxjs/operators";
import {AbstractApiModel} from "shared/abstract-api/classes/models";
import {EditableCell} from "./Cell.Editable";
import {DataTableExpandable} from "./DataTable.Expandable";
import {closeAction} from "./Inputs/input.component";

export class DataTableEditable<T extends AbstractApiModel> extends DataTableExpandable<T> {
  protected lastEdited: { col: number, row: T, action: closeAction } = null;
  protected currentObjects: T[] = null;
  protected goNext_: Subject<void> = new Subject();
  protected goNextSub: Subscription = null;

  public highlight(object: T) {
    const cell = this.getObjectCell(object);
    if (cell) {
      this.animate(cell.$tr);
    }
  }
  protected getObjectCell(object): EditableCell | null {
    let cell: EditableCell = null;
    this.dataTableApi.rows().eq(0).each((index) => {
      const _cell = EditableCell.fromRowIndex(index, this.dataTableApi) as EditableCell;
      if (object.isSame(_cell.object)) {
        cell = _cell;
      }
    });
    return cell;
  }

  public setDataSource$(dataSource$: Observable<T[]>) {
    this.currentObjects = null;
    super.setDataSource$(dataSource$);
    if (this.goNextSub !== null) {
      this.goNextSub.unsubscribe();
      this.goNextSub = null;
    }
    this.goNextSub = this.goNext_.pipe(takeUntil(this.close$)).subscribe(() => {
      if (this.lastEdited !== null && ["Tab", "Enter"].indexOf(this.lastEdited.action) !== -1) {
        const cell = this.getObjectCell(this.lastEdited.row);
        // console.log(this.lastEdited.row, cell.rowIndex);
        if (cell) {
          const nextEditableCell = this.columnsCollection.getNextEditableCell({
            col: this.lastEdited.col,
            row: cell.rowIndex,
          });
          this.manageCellClick(nextEditableCell);
        }
      }
      this.lastEdited = null;
    });
  }

  public deleteAction: (object: T) => Observable<boolean> = null;
  public updateAction: (object: T) => Observable<T> = null;
  public editAction: (object: T) => void = null;

  protected prepareDataSource$(dataSource$: Observable<T[]>): Observable<T[]> {
    return super.prepareDataSource$(dataSource$).pipe(
      tap((objects) => {
        if (this.currentObjects !== null) {
          objects.filter((object) => this.currentObjects.indexOf(object) === -1).forEach((object) => {
            this.highlight(object);
          });
        }
        this.currentObjects = objects;
        this.goNext_.next();
      }),
    );
  }

  protected animate($row: JQuery) {
    $row.addClass("bg-secondary animate");
    timer(1000).subscribe(() => {
      $row.removeClass("bg-secondary animate");
    });
  }

  protected clickToCell(click: JQuery.ClickEvent) {
    const $cell = $(click.currentTarget as HTMLElement);
    return new EditableCell($cell, this.dataTableApi);
  }

  protected manageCellClick(cell: EditableCell) {
    this.animate(cell.$tr);
    super.manageCellClick(cell);
    this.lastEdited = null;
    const cellUpdated$ = cell.getCellUpdated$(
      this.columnsCollection.getColumnAtIndex(cell.colIndex),
    );
    // null if already edited or readOnly
    if (cellUpdated$ !== null) {
      cellUpdated$.subscribe((data: { dirty: boolean, cell: EditableCell, action: closeAction }) => {
        this.lastEdited = {col: data.cell.colIndex, row: data.cell.object, action: data.action};
        if (data.dirty) {
          this.updateAction(cell.object).subscribe();
        } else {
          this.goNext_.next();
        }
      });
    }

    if (cell.name === "delete" && confirm("Confirmer la suppression de cet enregistrement ?")) {
      this.animate(cell.$tr);
      this.deleteAction(cell.object).subscribe();
    }

    if (cell.name === "edit") {
      this.editAction(cell.object);
    }
  }
}
