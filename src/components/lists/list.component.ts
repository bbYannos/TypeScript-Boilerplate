import {Column, DataTableEditable} from "modules/DataTable/module";
import {BehaviorSubject, Observable, of, Subscription} from "rxjs";
import {switchMap, takeUntil} from "rxjs/operators";
import {AbstractApiModel} from "shared/abstract-api/classes/models";
import {AbstractRepositoryService} from "shared/abstract-api/classes/services";
import Router from "vue-router";

/**
 * This component shows dataTable and add Button
 * It needs a service (RepositoryService) for CRUD
 * It manages dataSource$ for List
 * All theses functions can be override
 * See List.Factory for usage
 */
export class ListComponent<T extends AbstractApiModel> {
  public data: {
    addButtonDisplayed?: boolean,
    addButtonLabel?: string,
  } = {
    addButtonDisplayed: false,
    addButtonLabel: "",
  };

  public $htmEl: HTMLElement;
  public close$: Observable<any>;
  public add$: Observable<any>;
  public $router: Router;

  public loading_: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  protected add$ub: Subscription = null;
  protected overrideOptions: DataTables.Settings = {};
  protected service: AbstractRepositoryService<T> = null;
  protected columns: Column[] = [];
  protected _dataSource$ = null;
  protected _dataTable: DataTableEditable<T> = null;

  public render() {
    this.dataTable.setDataSource$(this.dataSource$.pipe(takeUntil(this.close$)));
    if (this.add$ub !== null) {
      this.add$ub.unsubscribe();
      this.add$ub = null;
    }
    this.add$ub = this.add$.pipe(takeUntil(this.close$)).pipe(
      switchMap(() => this.createAction()),
    ).subscribe();
  }

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
    this._dataSource$ = dataSource$.pipe(takeUntil(this.close$));
  }

  protected get dataTable(): DataTableEditable<T> {
    if (this._dataTable === null) {
      this._dataTable = new DataTableEditable();
      this._dataTable.columns = this.columns;
      this._dataTable.close$ = this.close$;
      this._dataTable.$htmEl = this.$htmEl;
      this._dataTable.editAction = this.editAction;
      this._dataTable.updateAction = this.updateAction;
      this._dataTable.deleteAction = this.deleteAction;
    }
    return this._dataTable;
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

  public updateAction: (object: T) => Observable<T> = (object: T) => {
    if (this.service !== null) {
      return this.service.update(object);
    }
    return of(object);
  };

  public editAction: (object: T) => void = (object: T) => {
    return;
  };
}
