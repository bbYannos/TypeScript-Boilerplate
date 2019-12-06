import {
  AbstractRelationManager,
  ChildrenListDefinition,
  OneToOneRelation,
  OneToParentRelation
} from "shared/abstract-api";
import {Exam, examService, ExamType, examTypeService, Training, trainingService} from "../Service";
import {trainingRelationManager} from "./Training.RelationManager";

const trainingRelation = new OneToParentRelation<Exam, Training>("training", "exams$", trainingService);
trainingRelationManager.childrenListDefinitions.push({
  propertyName: "exams$",
  defaultSource$: (object) => examService.getByTraining(object),
  jsonKey: "exams",
  service: examService,
} as ChildrenListDefinition<Training, Exam>);

const examTypeRelation = new OneToOneRelation<Exam, ExamType>("examType", examTypeService);

export class ExamRelationManager extends AbstractRelationManager<Exam> {
  protected service = examService;
  protected oneToOneRelations = [trainingRelation, examTypeRelation];
}

export const examRelationManager = new ExamRelationManager();
examRelationManager.init();
examRelationManager.debug = false;
