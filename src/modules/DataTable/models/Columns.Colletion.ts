import {EditableCell} from "./Cell.Editable";
import {EDITABLE_TYPES} from "../Constants";
import {Column} from "./Column";

export class ColumnsCollection {
  public dataTableApi;

  constructor(public columns: Column[]) {
    this.columns.forEach((column: Column, index: number) => {
      column.index = index;
    });
  }

  public cellCanBeNext(editableCellDefinition: Column) {
    const excluded = [EDITABLE_TYPES.colorPicker];
    return editableCellDefinition.type !== null && excluded.indexOf(editableCellDefinition.type) === -1;
  }

  public getColumnAtIndex(index: number): Column {
    const column = this.columns.find((_column: Column) => _column.index === index);
    return (column) ? column : null;
  }

  public getNextEditableCell({col: colIndex, row: rowIndex}: {col: number, row: number}): EditableCell {
    // v1 -> next editable same line
    let nextCell = this.columns
    .filter((editableCellDefinition) => this.cellCanBeNext(editableCellDefinition))
    .map((editableCellDefinition) => editableCellDefinition.index)
    .filter((_colIndex) => _colIndex > colIndex)
    .map((_colIndex) => EditableCell.fromRowAndColIndex(rowIndex, _colIndex, this.dataTableApi))
    .filter((editableCell) => editableCell !== null).shift();
    if (nextCell === undefined) {
      nextCell = null;
    }

    // v2 -> first editable next line
    const firstColIndex = this.columns
    .filter((editableCellDefinition) => this.cellCanBeNext(editableCellDefinition))
    .map((editableCellDefinition) => editableCellDefinition.index).shift();
    if (nextCell === null) {
      const _rowIndex = rowIndex + 1;
      nextCell = EditableCell.fromRowAndColIndex(_rowIndex, firstColIndex, this.dataTableApi);
      // console.log('v2 -> la premiere de la ligne suivante', rowIndex, firstColIndex, nextCell);
    }

    // v3 -> first editable first line
    if (nextCell === null) {
      nextCell = EditableCell.fromRowAndColIndex(0, firstColIndex, this.dataTableApi);
      // console.log('v3 -> la premiere de la premiere ligne', 0, firstColIndex, nextCell);
    }
    return nextCell;
  }
}
