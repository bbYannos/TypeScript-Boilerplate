import {forkJoin} from "rxjs";
import {map} from "rxjs/operators";
import {AbstractApiQuery, DexieRestService, Repository} from "shared/abstract-api";
import {Exam} from "../Exam/Exam.Model";
import {Trainee, traineeService} from "../Trainee";
import {ExamScore} from "./ExamScore.Model";
export {ExamScore};
export class ExamScoreQuery extends AbstractApiQuery<ExamScore> {
  public exam: Exam = null;
  public trainee: Trainee = null;
  protected equals = ["exam", "trainee"];
}

// tslint:disable-next-line
export class ExamScoreService extends  DexieRestService<ExamScore> {
  public repository: Repository<ExamScore> = new Repository<ExamScore>(ExamScore);

  public createByQuery(query: ExamScoreQuery) {
    const object = this.repository.makeNew();
    object.trainee = query.trainee;
    object.exam = query.exam;
    return this.create(object);
  }

  public getByTrainee(trainee: Trainee) {
   const query = new ExamScoreQuery();
   query.trainee = trainee;
   return this.list(query);
  }

  public getByExam(exam: Exam) {
    const trainees$ = traineeService.getByFormation(exam.training.formation);
    const query = new ExamScoreQuery();
    query.exam = exam;
    const scores$ = this.list(query);
    return forkJoin([trainees$, scores$]).pipe(
      map(([trainees, scores]: [Trainee[], ExamScore[]]) => {
        return trainees.map((trainee: Trainee) => {
          const _score = scores.find((score: ExamScore) => score.trainee.isSame(trainee));
          if (_score) {
            return _score;
          } else {
            const examScore = this.repository.makeNew();
            examScore.trainee = trainee;
            examScore.exam = exam;
            return examScore;
          }
        });
      }),
    );
  }
}
