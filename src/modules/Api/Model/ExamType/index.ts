import {RelationManager} from "shared/abstract-api";
import {ExamType, ExamTypeService} from "./ExamType.Service";

const examTypeService = new ExamTypeService();
// tslint:disable-next-line:no-unused-expression
new RelationManager(examTypeService);

export {ExamType, ExamTypeService, examTypeService};
