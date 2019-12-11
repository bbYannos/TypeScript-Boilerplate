import {forkJoin, Observable, of} from "rxjs";
import {map, shareReplay, switchMap, take, tap} from "rxjs/operators";
import {ServiceFactory} from "../../service.factory";
import {ObjectList} from "../lists";
import {AbstractApiModel, Debuggable} from "../models";
import {AbstractRepositoryService} from "../services/repository-service.model";
import {RelationManagerInterface} from "../services/repository.model";
import {ChildrenListDefinition} from "./children-list.definition";
import {ChildrenListFactory} from "./children-list.factory";
import {ChildrenList} from "./children-list.model";
import {OneToOneRelation} from "./index";

/**
 * Manage relation between models :
 * todo : Extend repository fromJson$ function instead of using fetchForeign$ ... or not
 * @action: Fetch foreign Object after repository fromJson$ - Needs Repository fetchForeign$ null function
 * @action: Listen to changes on foreign property to launch updates (ie: parent list update)
 * @action: Listen to repository delete action to launch updates (ie: parent list update)
 * Avoid Cyclic dependencies generated when linking services
 */
export class RelationManager<T extends AbstractApiModel> extends Debuggable implements RelationManagerInterface<T> {
  public childrenListDefinitions: Array<ChildrenListDefinition<T, any>> = [];
  public oneToOneRelations: Array<OneToOneRelation<T, any>> = [];
  constructor(
    protected service: AbstractRepositoryService<T>,
  ) {
    super();
    this.service.repository.relationManager = this;
  }

  public manageForeignRelations(object: T, json: any) {
    this.oneToOneRelations.forEach((relation) => {
      relation.listenObject(object);
    });
    this.manageChildrenLists(object, json);
    return object;
  }

  public rollbackForeignRelations = (object: T) => {
    this.oneToOneRelations.forEach((relation) => {
      relation.unListenObject(object);
    });
    return object;
  };

  public fetchForeign$(object: T, json: any = null): Observable<T> {
    const object$ = of(object);
    if (this.oneToOneRelations.length === 0) {
      return object$;
    }
    this.log("fetchForeign$", object);
    return object$.pipe(
      switchMap(() => {
        const getAllOneToOne$: Array<Observable<any>> = this.oneToOneRelations.map(
          (relation: OneToOneRelation<T, any>) => relation.fetchForeign$(object, json).pipe(
            take(1),
            tap((res) => this.log("FETCH FOREIGN DONE : ", relation.property)),
          ),
        );
        this.log("FETCH FOREIGN CALLED", getAllOneToOne$.length);
        return forkJoin(getAllOneToOne$).pipe(
          tap(() => this.log("ALL FETCH FOREIGN DONE")),
          map(() => object),
        );
      }),
    );
  }

  protected manageChildrenLists(object: T, json: any) {
    this.log("manageChildrenLists " + this.service.name + " " + object.identifier);
    this.childrenListDefinitions.forEach((childrenListDefinition: ChildrenListDefinition<T, any>) => {
      this.log("ChildrenLists " + childrenListDefinition.propertyName);
      let source$ = childrenListDefinition.defaultSource$(object);
      if (childrenListDefinition.debug) {
        console.log("Children List From Json", (json !== null && json[childrenListDefinition.jsonKey] !== undefined));
      }
      if (json !== null && json[childrenListDefinition.jsonKey] !== undefined) {
        if (childrenListDefinition.debug) {
          console.log("Children List Json", json[childrenListDefinition.jsonKey]);
        }
        source$ = childrenListDefinition.service.repository.fromJsonArray$(json[childrenListDefinition.jsonKey]).pipe(
          shareReplay(1),
        );
      }
      const childrenList = this.createChildrenList(object, childrenListDefinition.propertyName, source$, childrenListDefinition.listConstructor);
      childrenList.list.debug = childrenListDefinition.debug;
    });
    return object;
  }

  protected createChildrenList<U extends AbstractApiModel>(
    object: T,
    propertyName: keyof T,
    source$: Observable<U[]>,
    ctor: new (...param) => ObjectList<U> = ObjectList,
  ): ChildrenList<U> {
    let childrenList = ChildrenListFactory.getChildrenListForProperty(object, propertyName as string);
    if (childrenList === null) {
      childrenList = new ChildrenList<U>();
      childrenList.identifier = ChildrenListFactory.getIdentifierForProperty(propertyName as string);
      childrenList.list = new ctor(object);
      childrenList.list.source$ = source$;
      object.lists.push(childrenList);
      const attributes = {
        get: () => {
          return childrenList.list.change$;
        },
      };
      Object.defineProperty(object, propertyName, attributes);
    }
    return childrenList as ChildrenList<U>;
  }
}
