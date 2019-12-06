import {AbstractRelationManager, OneToOneRelation} from "shared/abstract-api";
import {Exam, ExamScore, examScoreService, examService, Trainee, traineeService} from "../Service";

const examRelation = new OneToOneRelation<ExamScore, Exam>("exam", examService);
const traineeRelation = new OneToOneRelation<ExamScore, Trainee>("trainee", traineeService);

export class ExamScoreRelationManager extends AbstractRelationManager<ExamScore> {
  protected service = examScoreService;
  protected oneToOneRelations = [examRelation, traineeRelation];
}

export const examScoreRelationManager = new ExamScoreRelationManager();
examScoreRelationManager.init();
examScoreRelationManager.debug = false;
