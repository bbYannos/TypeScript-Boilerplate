import {DexieRestService, Repository} from "shared/abstract-api";
import {ExamType} from "./ExamType.Model";
export {ExamType};
export class ExamTypeService extends DexieRestService<ExamType> {
  public repository: Repository<ExamType> = new Repository<ExamType>(ExamType);

  public createByQuery(query: any = null) {
    const examType = this.repository.makeNew();
    return this.create(examType);
  }
}
