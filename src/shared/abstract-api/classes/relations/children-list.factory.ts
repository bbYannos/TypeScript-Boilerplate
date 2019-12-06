import {AbstractApiModel} from "../models";
import {ChildrenList} from "./children-list.model";

export class ChildrenListFactory {
  // trainings$ => trainingsList
  public static getIdentifierForProperty(propertyName: string) {
    return propertyName.replace("$", "") + "List";
  }

  public static getChildrenListForProperty<T extends AbstractApiModel>(parent: AbstractApiModel, propertyName: string): ChildrenList<T> {
    const identifier = this.getIdentifierForProperty(propertyName);
    return this.getChildrenListByIdentifier(parent, identifier);
  }

  protected static getChildrenListByIdentifier<T extends AbstractApiModel>(parent: AbstractApiModel, identifier: string): ChildrenList<T> {
    if (parent === null) {
      return null;
    }
    if (!parent.lists) {
      console.log("parent has no list", parent, identifier);
      return null;
    }
    const childrenList = parent.lists.find((parentList) => parentList.identifier === identifier);
    if (!childrenList) {
      return null;
    }
    return childrenList as ChildrenList<T>;
  }
}
