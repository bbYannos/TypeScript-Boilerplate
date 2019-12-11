import {OneToOneRelation, RelationManager} from "shared/abstract-api";
import {Exam, examService} from "../Exam";
import {Trainee, traineeService} from "../Trainee";
import {ExamScore, ExamScoreService} from "./ExamScore.Service";

const examScoreService = new ExamScoreService();
const relationManager = new RelationManager(examScoreService);
relationManager.oneToOneRelations = [
  new OneToOneRelation<ExamScore, Exam>("exam", examService),
  new OneToOneRelation<ExamScore, Trainee>("trainee", traineeService)
];

export {ExamScore, ExamScoreService, examScoreService};

