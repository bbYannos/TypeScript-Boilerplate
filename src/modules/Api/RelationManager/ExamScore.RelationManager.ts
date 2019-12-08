import {AbstractRelationManager, OneToOneRelation, ServiceFactory} from "shared/abstract-api";
import {Exam} from "../Model/Exam.Model";
import {ExamScore} from "../Model/ExamScore.Model";
import {Trainee} from "../Model/Trainee.Model";
import {ExamService} from "../Service/Exam.Service";
import {ExamScoreService} from "../Service/ExamScore.Service";
import {TraineeService} from "../Service/Trainee.Service";


const examRelation = new OneToOneRelation<ExamScore, Exam>("exam", ServiceFactory.getService(ExamService));
const traineeRelation = new OneToOneRelation<ExamScore, Trainee>("trainee", ServiceFactory.getService(TraineeService));

export class ExamScoreRelationManager extends AbstractRelationManager<ExamScore> {
  protected service = ServiceFactory.getService(ExamScoreService);
  protected oneToOneRelations = [examRelation, traineeRelation];
}

export const examScoreRelationManager = new ExamScoreRelationManager();
examScoreRelationManager.init();
examScoreRelationManager.debug = false;
