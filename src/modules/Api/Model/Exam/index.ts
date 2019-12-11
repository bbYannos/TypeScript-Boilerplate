import {ChildrenListDefinition, OneToOneRelation, OneToParentRelation, RelationManager} from "shared/abstract-api";
import {ExamType, examTypeService} from "../ExamType";
import {Training, trainingService} from "../Training";
import {Exam, ExamService} from "./Exam.Service";

const examService = new ExamService();
const relationManager = new RelationManager(examService);
relationManager.oneToOneRelations = [
  new OneToParentRelation<Exam, Training>("training", "exams$", trainingService),
  new OneToOneRelation<Exam, ExamType>("examType", examTypeService),
];

trainingService.repository.relationManager.childrenListDefinitions.push({
  propertyName: "exams$",
  defaultSource$: (object) => examService.getByTraining(object),
  jsonKey: "exams",
  service: examService,
} as ChildrenListDefinition<Training, Exam>);

export {Exam, ExamService, examService};
