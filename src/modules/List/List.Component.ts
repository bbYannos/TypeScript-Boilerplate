import {AbstractApiModel, AbstractRepositoryService} from "@AbstractApi";
import {ButtonComponent} from "Components/Button/Button.Component";
import {AbstractEditableDataTable, EditableCellDefinition} from "Shared/DataTable";
import {routerService} from "@Layouts";
import {AbstractNjkComponent} from "@Njk";
import {Observable, of} from "rxjs";
import {map, takeUntil} from "rxjs/operators";

export class EditableDataTable<T extends AbstractApiModel> extends AbstractEditableDataTable<T> {
  public service: AbstractRepositoryService<T> = null;
  protected constructorName: string = null;
  protected editableCellDefinitions: EditableCellDefinition[] = [];
  protected overrideOptions: DataTables.Settings = {};

  public setOptions(overrideOptions: DataTables.Settings, editableCellDefinitions: EditableCellDefinition[]) {
    this.overrideOptions = overrideOptions;
    this.editableCellDefinitions = editableCellDefinitions;
  }
}

/**
 * This component shows dataTable and add Button
 * It needs a service (RepositoryService) for CRUD
 * It manages dataSource$ for List
 * All theses functions can be override
 * See List.Factory for usage
 */
export class ListComponent<T extends AbstractApiModel> extends AbstractNjkComponent {
  public service: AbstractRepositoryService<T> = null;
  public overrideOptions: DataTables.Settings = {};
  public editableCellDefinitions: EditableCellDefinition[] = [];
  public addButton: ButtonComponent = null;
  protected njk = require('./List.Component.njk');
  protected constructorName = null;
  protected njkParams = {
    addLabel: '',
  };

  protected _dataSource$ = null;

  public get dataSource$(): Observable<T[]> {
    if (this._dataSource$ !== null) {
      return this._dataSource$;
    }
    if (this.service !== null) {
      return (this.service as any).fetchAll$;
    }
    return of([]);
  }

  public set dataSource$(dataSource$) {
    this._dataSource$ = dataSource$
  }

  protected _dataTable: EditableDataTable<T> = null;

  protected get dataTable(): EditableDataTable<T> {
    if (this._dataTable === null) {
      this._dataTable = new EditableDataTable();
      this._dataTable.setOptions(this.overrideOptions, this.editableCellDefinitions);
      this._dataTable.editAction = this.editAction;
      this._dataTable.updateAction = this.updateAction;
      this._dataTable.deleteAction = this.deleteAction;
    }
    return this._dataTable;
  }

  public render() {
    super.render();
    this.dataTable.$htmEl = this.$htmEl.find('.ListComponent');
    this.dataTable.setDataSource$(this.dataSource$);
    if (this.createAction !== null) {
      this.addButton = this.loadChild(ButtonComponent, true);
      this.addButton.click$.pipe(takeUntil(routerService.close$)).subscribe(() => {
        this.createAction().subscribe();
      });
    }
  }

  public createAction: () => Observable<T> = () => {
    if (this.service !== null) {
      return this.service.create(this.service.repository.makeNew());
    }
    return of(null);
  };

  public deleteAction: (object: T) => Observable<boolean> = (object: T) => {
    if (this.service !== null) {
      return this.service.delete(object);
    }
    return of(false);
  };

  public updateAction: (object: T) => Observable<boolean> = (object: T) => {
    if (this.service !== null) {
      return this.service.update(object).pipe(map(() => true))
    }
    return of(false);
  };

  public editAction: (object: T) => void = (object: T) => {
    routerService.setCurrent('/' + object.constructorName.toLowerCase() + '/' + object.identifier);
  };
}

