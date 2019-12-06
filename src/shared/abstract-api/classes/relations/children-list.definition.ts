import {Observable} from "rxjs";
import {ObjectList} from "../lists";
import {AbstractApiModel} from "../models";
import {AbstractRepositoryService} from "../services/repository-service.model";



/**
 * Used By Relation Manager to create list$ in parent then store children as Observable[]
 * T: Parent, U: Children
 * propertyName* : key in T of observable list
 * defaultSource$* : Observable source for Object List ie: service.list(request)
 * If Parent Json MAY contain children json : set jsonKey and service
 * Relation Manager will populate children with service.fromJsonArray$(parentJson[jsonKey])
 * Else fetch children from defaultSource$
 * if list listConstructor, basic ObjectList is used
 */
export class ChildrenListDefinition<T, U extends AbstractApiModel> {
  public propertyName: keyof T;
  public defaultSource$: (object) => Observable<any[]>;
  public jsonKey?: string = null;
  public service?: AbstractRepositoryService<U> = null;
  public listConstructor?: new (...param) => ObjectList<U> = ObjectList;
  public debug?: boolean = false;
}
/*** @template :
 parentRelationManager.childrenListDefinitions.push({
    propertyName: "list$",
    defaultSource$: (object) => childrenService.list({parent: parent}),
    jsonKey: "children",
    service: childrenService,
    listConstructor: PeriodList,
  } as ChildrenListDefinition<T, U>);
*/
