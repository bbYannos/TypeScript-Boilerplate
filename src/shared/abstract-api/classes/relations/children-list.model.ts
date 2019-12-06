import {ObjectList} from "../lists";
import {AbstractApiModel} from "../models";

export class ChildrenList<T extends AbstractApiModel> {
  public identifier: string;
  public list: ObjectList<T>;
}
