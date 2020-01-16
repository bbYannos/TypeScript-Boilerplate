import {ChildrenListDefinition, OneToOneRelation, OneToParentRelation, RelationManager} from "shared/abstract-api";
import {Exam, examService} from "../Exam";
import {Trainee, traineeService} from "../Trainee";
import {ExamScore, ExamScoreService} from "./ExamScore.Service";

const examRelation = new OneToParentRelation<ExamScore, Exam>("exam", "scores$", examService);
examRelation.watchedProperties = ["score"];
const examScoreService = RelationManager.makeService(ExamScoreService, [
  examRelation,
  new OneToOneRelation<ExamScore, Trainee>("trainee", traineeService),
]);

examService.repository.relationManager.childrenListDefinitions.push({
  propertyName: "scores$",
  defaultSource$: (object) => examScoreService.getByExam(object),
} as ChildrenListDefinition<Exam, ExamScore>);

examService.repository.relationManager.finalizeFunctions.push(
  (exam: Exam) => {
    const property = "getScoreByTrainee";
    const attributes = {
      value: (trainee: Trainee) => {
        let  score: ExamScore = exam.scores.find((_score) => _score.trainee.identifier === trainee.identifier) || null;
        if (!score) {
          score = examScoreService.repository.makeNew();
          score.exam = exam;
          score.trainee = trainee;
        }
        return score;
      },
    };
    Object.defineProperty(exam, property, attributes);
  },
);

export {ExamScore, ExamScoreService, examScoreService};

