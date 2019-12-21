import {forkJoin, Observable} from "rxjs";
import {map, shareReplay, switchMap, take, tap} from "rxjs/operators";
import {RxjsUtils} from "../../rxjs.utils";
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
  public finalizeFunctions: Array<(object: T, json) => void> = [];

  constructor(
    protected service: AbstractRepositoryService<T>,
  ) {
    super();
  }

  public static makeService<U extends AbstractApiModel, V extends AbstractRepositoryService<U>>(
    Service: new () => V,
    relations: Array<OneToOneRelation<U, any>> = []
  ): V {
    const service = new Service();
    const relationManager = new RelationManager(service);
    relationManager.oneToOneRelations = relations;
    service.repository.relationManager = relationManager;
    return service;
  }

  public manageForeignRelations(object: T, json: any) {
    this.oneToOneRelations.forEach((relation) => {
      if (relation.listenObject !== null) {
        relation.listenObject(object);
      }
    });
    this.manageChildrenLists(object, json);
    this.finalize(object, json);
    return object;
  }

  public rollbackForeignRelations = (object: T) => {
    this.log("rollbackForeignRelations", this.service.name + ":" + this.oneToOneRelations.length);
    this.oneToOneRelations.forEach((relation) => {
      if (relation.unListenObject !== null) {
        relation.unListenObject(object);
      }
    });
    object.lists = [];
    return object;
  };

  public fetchForeign$(object: T, json: any = null): Observable<T> {
    this.log("RELATION MANAGER fetchForeign$ FOR " + object.constructorName + object.identifier + " start", this.oneToOneRelations.length);
    const object$ = RxjsUtils.of(object);
    if (this.oneToOneRelations.length === 0) {
      return object$;
    }
    return  object$.pipe(
      switchMap(() => {
        const getAllOneToOne$: Array<Observable<any>> = this.oneToOneRelations.map(
          (relation: OneToOneRelation<T, any>) => relation.fetchForeign$(object, json).pipe(
              take(1),
              tap(() => this.log("FETCH FOREIGN DONE : ", relation.property)),
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

  protected finalize(object: T, json: any) {
    this.finalizeFunctions.forEach((func) => {
      func(object, json);
    });
  }

  protected manageChildrenLists(object: T, json: any) {
    this.log("manageChildrenLists " + this.service.name + " " + object.identifier);
    this.childrenListDefinitions.forEach((childrenListDefinition: ChildrenListDefinition<T, any>) => {
      this.log("ChildrenLists " + childrenListDefinition.propertyName);
      let source$ = childrenListDefinition.defaultSource$(object);
      if (childrenListDefinition.debug || this.debug) {
        console.log("Children List From Json", (json !== null && json[childrenListDefinition.jsonKey] !== undefined));
      }
      if (json !== null && json[childrenListDefinition.jsonKey] !== undefined) {
        if (childrenListDefinition.debug || this.debug) {
          console.log("Children List Json", json[childrenListDefinition.jsonKey]);
        }
        source$ = childrenListDefinition.service.repository.fromJsonArray$(json[childrenListDefinition.jsonKey]).pipe(
          shareReplay(1),
        );
      }
      this.log("CreateChildrenList", childrenListDefinition.propertyName);
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
