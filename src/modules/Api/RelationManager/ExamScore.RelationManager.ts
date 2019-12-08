import {AbstractRelationManager, OneToOneRelation} from "shared/abstract-api";
import {Exam, ExamService} from "../Service/Exam.Service";
import {ExamScore, ExamScoreService} from "../Service/ExamScore.Service";
import {Trainee, TraineeService} from "../Service/Trainee.Service";

const examRelation = new OneToOneRelation<ExamScore, Exam>("exam", ExamService);
const traineeRelation = new OneToOneRelation<ExamScore, Trainee>("trainee", TraineeService);

export class ExamScoreRelationManager extends AbstractRelationManager<ExamScore> {
  protected Service = ExamScoreService;
  protected oneToOneRelations = [examRelation, traineeRelation];
}

export const examScoreRelationManager = new ExamScoreRelationManager();
examScoreRelationManager.init();
examScoreRelationManager.debug = false;
