import {
  AbstractRelationManager,
  ChildrenListDefinition,
  OneToOneRelation,
  OneToParentRelation,
  ServiceFactory,
} from "shared/abstract-api";
import {Exam, ExamService} from "../Service/Exam.Service";
import {ExamType, ExamTypeService} from "../Service/ExamType.Service";
import {Training, TrainingService} from "../Service/Training.Service";
import {trainingRelationManager} from "./Training.RelationManager";

const trainingRelation = new OneToParentRelation<Exam, Training>("training", "exams$", TrainingService);

const examService = ServiceFactory.getService(ExamService);
trainingRelationManager.childrenListDefinitions.push({
  propertyName: "exams$",
  defaultSource$: (object) => examService.getByTraining(object),
  jsonKey: "exams",
  service: examService,
} as ChildrenListDefinition<Training, Exam>);

const examTypeRelation = new OneToOneRelation<Exam, ExamType>("examType", ExamTypeService);

export class ExamRelationManager extends AbstractRelationManager<Exam> {
  protected Service = ExamService;
  protected oneToOneRelations = [trainingRelation, examTypeRelation];
}

export const examRelationManager = new ExamRelationManager();
examRelationManager.init();
examRelationManager.debug = false;
