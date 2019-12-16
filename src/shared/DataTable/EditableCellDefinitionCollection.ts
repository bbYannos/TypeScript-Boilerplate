import {EditableCellClick} from "./CellClick.Editable";
import {EDITABLE_TYPES} from "./Constants";
import {EditableCellDefinition} from "./EditableCellDefinition";

export class EditableCellDefinitionsCollection {
  public dataTableApi;

  constructor(protected editableCellDefinitions: EditableCellDefinition[]) {
  }

  // noinspection JSMethodCanBeStatic
  public cellCanBeNext(editableCellDefinition: EditableCellDefinition) {
    const excluded = [EDITABLE_TYPES.colorPicker];
    return editableCellDefinition.type !== null && excluded.indexOf(editableCellDefinition.type) === -1;
  }

  public getDefinitionAtIndex(index: number): EditableCellDefinition {
    const definition = this.editableCellDefinitions.find((editableCellDefinition: EditableCellDefinition) => editableCellDefinition.index === index);
    if (!definition) {
      return null;
    }
    return definition;
  }

  public getNextEditableCell({col: colIndex, row: rowIndex}: {col: number, row: number}): EditableCellClick {
    // v1 -> next editable same line
    let nextCell = this.editableCellDefinitions
    .filter((editableCellDefinition) => this.cellCanBeNext(editableCellDefinition))
    .map((editableCellDefinition) => editableCellDefinition.index)
    .filter((_colIndex) => _colIndex > colIndex)
    .map((_colIndex) => EditableCellClick.fromRowAndColIndex(rowIndex, _colIndex, this.dataTableApi))
    .filter((editableCell) => editableCell !== null).shift();
    if (nextCell === undefined) {
      nextCell = null;
    }

    // v2 -> first editable next line
    const firstColIndex = this.editableCellDefinitions
    .filter((editableCellDefinition) => this.cellCanBeNext(editableCellDefinition))
    .map((editableCellDefinition) => editableCellDefinition.index).shift();
    if (nextCell === null) {
      const _rowIndex = rowIndex + 1;
      nextCell = EditableCellClick.fromRowAndColIndex(_rowIndex, firstColIndex, this.dataTableApi);
      // console.log('v2 -> la premiere de la ligne suivante', rowIndex, firstColIndex, nextCell);
    }

    // v3 -> first editable first line
    if (nextCell === null) {
      nextCell = EditableCellClick.fromRowAndColIndex(0, firstColIndex, this.dataTableApi);
      // console.log('v3 -> la premiere de la premiere ligne', 0, firstColIndex, nextCell);
    }
    return nextCell;
  }
}
