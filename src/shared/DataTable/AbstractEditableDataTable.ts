import {Observable, timer} from "rxjs";
import {tap} from "rxjs/operators";
import {AbstractApiModel} from "shared/abstract-api/classes/models";
import {AbstractExpandableDataTable} from "./AbstractExpandableDataTable";
import {EditableCellClick} from "./CellClick.Editable";
import {EditableCellDefinition} from "./EditableCellDefinition";
import {EditableCellDefinitionsCollection} from "./EditableCellDefinitionCollection";
import ClickEvent = JQuery.ClickEvent;


export abstract class AbstractEditableDataTable<T extends AbstractApiModel> extends AbstractExpandableDataTable<T> {
  protected abstract editableCellDefinitions: EditableCellDefinition[];
  protected editableCellDefinitionsCollection: EditableCellDefinitionsCollection;
  protected lastEdited: { col: number, row: number, keyPressed: string } = null;
  protected currentObjects: T[] = null;

  public highlight(object: T) {
    this.dataTableApi.rows().eq(0).each((index) => {
      const cellClick = EditableCellClick.fromRowIndex(index, this.dataTableApi);
      if (object.isSame(cellClick.object)) {
        this.animate(cellClick.$tr);
      }
    });
  }

  public deleteAction: (object: T) => Observable<boolean> = null;
  public updateAction: (object: T) => Observable<boolean> = null;
  public editAction: (object: T) => void = null;

  public afterEditClosed() {
    if (this.lastEdited !== null && ["Tab", "Enter"].indexOf(this.lastEdited.keyPressed) !== -1) {
      const nextEditableCell = this.editableCellDefinitionsCollection.getNextEditableCell(this.lastEdited);
      this.manageCellClick(nextEditableCell);
    }
    this.lastEdited = null;
  }

  protected initDataTable() {
    super.initDataTable();
    this.editableCellDefinitionsCollection = new EditableCellDefinitionsCollection(this.editableCellDefinitions);
    this.editableCellDefinitionsCollection.dataTableApi = this.dataTableApi;
  }

  protected prepareDataSource$(dataSource$: Observable<T[]>): Observable<T[]> {
    return super.prepareDataSource$(dataSource$).pipe(
      tap((objects) => {
        if (this.currentObjects !== null) {
          objects.filter((object) => this.currentObjects.indexOf(object) === -1).forEach((object) => {
            this.highlight(object);
          });
        }
        this.currentObjects = objects;
        this.afterEditClosed();
      }),
    );
  }

  protected animate($row: JQuery) {
    $row.addClass("bg-secondary animate");
    timer(500).subscribe(() => {
      $row.removeClass("bg-secondary animate");
    });
  }

  protected clickToCellClick(click: ClickEvent) {
    const $cell = $(click.currentTarget as HTMLElement);
    return new EditableCellClick($cell, this.dataTableApi);
  }

  protected manageCellClick(cellClick: EditableCellClick) {
    super.manageCellClick(cellClick);
    this.lastEdited = null;
    const cellUpdated$ = cellClick.getCellUpdated$(
      this.editableCellDefinitionsCollection.getDefinitionAtIndex(cellClick.colIndex),
    );
    // null if already edited or readOnly
    if (cellUpdated$ !== null) {
      cellUpdated$.subscribe((data: { dirty: boolean, cellClick: EditableCellClick, keyPressed?: string }) => {
        this.lastEdited = {col: data.cellClick.colIndex, row: data.cellClick.rowIndex, keyPressed: data.keyPressed};
        if (data.dirty) {
          this.updateAction(cellClick.object).subscribe(() => {
            timer(300).subscribe(() => this.afterEditClosed());
          });
        } else {
          this.afterEditClosed();
        }
      });
    }

    if (cellClick.name === "delete" && confirm("Confirmer la suppression de cet enregistrement ?")) {
      this.animate(cellClick.$tr);
      this.deleteAction(cellClick.object).subscribe();
    }

    if (cellClick.name === "edit") {
      this.editAction(cellClick.object);
    }
  }
}
