import {BehaviorSubject, Observable} from "rxjs";
import {auditTime, filter, shareReplay, take, tap} from "rxjs/operators";
import {AbstractApiModel, AbstractIdentifiedObject, Debuggable} from "../models";

export class ObjectList<T extends AbstractIdentifiedObject> extends Debuggable {

  public get parentName() {
    return (this.parent !== null) ? this.parent.constructorName : "Repository All$";
  }

  // Wrap this change$ in pipe(mergeMap to avoid direct call to Api
  // mySource$ = repository.changes$ -> Call Api immediately
  // mySource$ = of(true).pipe(switchMap(() => this.repository.change$)) -> Call Api on Subscribe
  public get change$() {
    this.log("Ask for change$", "ParentName : " + this.parentName);
    if (this.populated === false && this.loading === false && this.source$ !== null) {
      this.loading = true;
      this._objects.length = 0;
      this.log("source$ called ");
      this.source$.pipe(take(1)).subscribe((_objects: T[]) => {
        this.loading = false;
        this.log("source$ emit");
        this.log(this.parentName, this._objects);
        // if children don"t attach themselves to parentList
        if (this._objects.length === 0 && _objects.length > 0) {
          this.pushAll(_objects);
        }
        this.populated = true;
        this.log("Source Emit change");
        this.emitChange();
      });
    }
    return this._change$;
  }
  public loading: boolean = false;
  public populated: boolean = false;
  public source$: Observable<T[]> = null;
  protected change_: BehaviorSubject<T[]> = new BehaviorSubject<T[]>([]);
  protected _objects: T[] = [];

  protected _change$ = this.change_.asObservable().pipe(
    filter(() => this.populated),
    tap(() => this.log("EMIT for ", this.parentName)),
    // throttleTime : Emit first then Wait x
    // auditTime : Wait x after first to Emit
    // debounceTime : Wait silence of x after last and Emit
    // NOT SURE : debounce or auditTime with shareReplay will emit an old version in case of delete and take(1)
    // throttleTime will emit incomplete updated values in case of concurrent updates
    // @see use case : FormationRelationManager.fetchAllVacations$
    auditTime(1),
    // share useless if shareReplay()
    // share(),
    tap(() => this.log("Prepare Shared for ", this.parentName)),
    shareReplay(1),
    tap(() => this.log("Send Shared for ", this.parentName)),
  );

  constructor(public parent: AbstractApiModel = null) {
    super();
  }

  public emitChange() {
    this.log("EMIT CHANGE :", this.parentName, this.toArray(), this.populated);
    // console.trace();
    this.change_.next(this.toArray());
  }

  /**
   * Return existing object or null
   */
  public getByIdentifier(identifier: string): T {
    identifier = identifier.toString();
    const identifiedObject = this._objects.find((_object: T) => (_object.hasIdentifier(identifier)));
    return identifiedObject || null;
  }

  // Do not set object.deleted = true
  // Object can be removed from list without being deleted
  public delete(object: T, emit: boolean = true): boolean {
    if (this.contains(object)) {
      // console.log(this.parentName + "Length before delete : " + this._objects.length );
      this._objects = this._objects.filter((_object: T) => (!_object.isSame(object)));
      // console.log(this.parentName + "Length after delete : " + this._objects.length );
      if (emit) {
        // console.log("EMIT CHANGE AFTER DELETE");
        this.emitChange();
      }
      return true;
    }
    return false;
  }

  public pushAll(objects: T[]): ObjectList<T> {
    objects.forEach((_object: T) => {
      this.push(_object, false);
    });
    this.emitChange();
    return this;
  }

  public toArray(showHidden: boolean = false): T[] {
    return this._objects.filter((object) => showHidden || !object.deleted === true);
  }

  public toDirty(): T[] {
    return this._objects.filter((object) => object.dirty || object.apiId === null);
  }

  /**
   * Add Object if identifier not present in list
   */
  public push(object: T, emit: boolean = true): boolean {
    if (!this.contains(object)) {
      this._objects.push(object);
      if (emit) {
        this.emitChange();
      }
      return true;
    }
    return false;
  }

  public contains(object: T): boolean {
    return (this._objects.filter((_object: T) => _object.isSame(object)).length > 0);
  }
}
