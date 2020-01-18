import Api from "modules/Api/Api.module";
import {Exam} from "modules/Api/Model/Exam";
import {Formation} from "modules/Api/Model/Formation";
import {Module} from "modules/Api/Model/Module";
import {Trainee} from "modules/Api/Model/Trainee";
import {Training, TrainingQuery} from "modules/Api/Model/Training/Training.Service";
import {Observable} from "rxjs";
import {map, switchMap, tap} from "rxjs/operators";
import {RxjsUtils} from "shared/abstract-api";

export class AverageManager {
  protected static formation: Formation = null;
  public static trainings: Training[] = [];
  public static modules: Module[] = [];

  public static prepare$(formation: Formation): Observable<Formation> {
    this.formation = formation;
    const query: TrainingQuery = new TrainingQuery();
    query.formation = formation;
    query.canHaveExams = true;
    return formation.modules$.pipe(
      tap((modules: Module[]) =>  this.modules = modules),
      switchMap(() => Api.trainingService.list(query)),
      tap((trainings: Training[]) =>  this.trainings = trainings),
      switchMap((trainings: Training[]) =>
        RxjsUtils.combineAndFlat(trainings.map((training: Training) => training.exams$)),
      ),
      switchMap((exams: Exam[]) =>
        RxjsUtils.combineAndFlat(exams.map((exam: Exam) => exam.scores$)),
      ),
      switchMap(() => formation.modules$),
      map(() => formation),
    );
  }

  public static byModule(trainee: Trainee, module: Module) {
    const trainings = this.trainings;
  }

  public static getTrainingsByModule(module: Module) {
    return this.trainings.filter((training: Training) => module.isSame(training.module));
  }

  public static averageByModuleTrainings(trainee: Trainee, module: Module) {
    return this.averageByTrainings(trainee, this.getTrainingsByModule(module));
  }

  public static averageByFormation(trainee: Trainee) {
    return this.averageByTrainings(trainee, this.formation.trainings);
  }

  public static averageByTrainings(trainee: Trainee, trainings: Training[]): number {
    let averageScore = 0;
    let averageRatio = 0;
    trainings.forEach((training: Training) => {
      const score = this.averageByTraining(trainee, training);
      if (score !== null) {
        averageRatio += training.coefficient;
        averageScore +=  score * training.coefficient;
      }
    });
    if (averageRatio > 0) {
      return Math.round((averageScore / averageRatio) * 100) / 100;
    }
    return null;
  }

  public static averageByTraining(trainee: Trainee, training: Training) {
    if (!training.canHaveExams) {
      return null;
    }
    let averageScore = 0;
    let averageRatio = 0;
    training.exams.forEach((exam: Exam) => {
      const score = exam.getScoreByTrainee(trainee).score;
      if (score !== null) {
        averageScore += exam.getScoreByTrainee(trainee).score * exam.coefficient;
        averageRatio += exam.coefficient;
      }
    });
    if (averageRatio > 0) {
      return Math.round((averageScore / averageRatio) * 100) / 100;
    }
    return null;
  }
}
