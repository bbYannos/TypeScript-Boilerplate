import {AbstractApiModel} from "../models";
import {ChildrenListFactory} from "./children-list.factory";
import {OneToParentRelation} from "./one-to-parent.relation";


interface AbstractApiModelWithGenericParent extends AbstractApiModel {
  parent: AbstractApiModel;
  parentClass: string;
}

/**
 * Service must be defined by function oneToGenericParentRelation.getServiceForForeign(object)
 * Depending on parentClass
 */

/*** @template :
relation.getServiceForForeign = (object: T): AbstractRepositoryService<A | B> => {
  if (object.parentClass === A.constructorName) {
    return service < A >;
  } else {
    return service < B >;
  }
};
*/
export class OneToGenericParentRelation<T extends AbstractApiModelWithGenericParent, U extends AbstractApiModel> extends OneToParentRelation<T, U> {
  constructor(public parentProperty: keyof U = null) {
    super("parent", parentProperty, null);
  }

  public updateOnChange = (object: T, previousParent: U, newParent: U) => {
    if (previousParent !== null) {
      ChildrenListFactory.getChildrenListForProperty(previousParent, (this.parentProperty as string)).list.delete(object);
      object.parentClass = "";
    }
    if (newParent !== null) {
      ChildrenListFactory.getChildrenListForProperty(newParent, (this.parentProperty as string)).list.push(object);
      object.parentClass = newParent.constructorName;
    }
  }
}
