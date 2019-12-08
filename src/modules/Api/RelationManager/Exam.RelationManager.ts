import {
  AbstractRelationManager,
  ChildrenListDefinition,
  OneToOneRelation,
  OneToParentRelation,
  ServiceFactory,
} from "shared/abstract-api";
import {Exam} from "../Model/Exam.Model";
import {ExamType} from "../Model/ExamType.Model";
import {Training} from "../Model/Training.Model";
import {ExamService} from "../Service/Exam.Service";
import {ExamTypeService} from "../Service/ExamType.Service";
import {TrainingService} from "../Service/Training.Service";
import {trainingRelationManager} from "./Training.RelationManager";

const trainingRelation = new OneToParentRelation<Exam, Training>("training", "exams$", ServiceFactory.getService(TrainingService));

const examService = ServiceFactory.getService(ExamService);
trainingRelationManager.childrenListDefinitions.push({
  propertyName: "exams$",
  defaultSource$: (object) => examService.getByTraining(object),
  jsonKey: "exams",
  service: examService,
} as ChildrenListDefinition<Training, Exam>);

const examTypeRelation = new OneToOneRelation<Exam, ExamType>("examType", ServiceFactory.getService(ExamTypeService));

export class ExamRelationManager extends AbstractRelationManager<Exam> {
  protected service = examService;
  protected oneToOneRelations = [trainingRelation, examTypeRelation];
}

export const examRelationManager = new ExamRelationManager();
examRelationManager.init();
examRelationManager.debug = false;
