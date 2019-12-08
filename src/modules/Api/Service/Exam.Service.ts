import {Observable} from "rxjs";
import {AbstractApiQuery, DexieRestService, Repository} from "shared/abstract-api";
import {Exam} from "../Model/Exam.Model";
import {Training} from "../Model/Training.Model";
export {Exam};
export class ExamQuery extends AbstractApiQuery<Exam> {
  public training: Training = null;
  protected equals = ["training"];
}

export class ExamService extends DexieRestService<Exam> {
  public repository: Repository<Exam> = new Repository<Exam>(Exam);

  public createByQuery(query: ExamQuery) {
    const exam = this.repository.makeNew();
    exam.training = query.training;
    return super.create(exam);
  }

  public getByTraining(training: Training): Observable<Exam[]> {
    const query = new ExamQuery();
    query.training = training;
    return this.list(query);
  }
}
