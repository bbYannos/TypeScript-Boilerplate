import {RelationManager} from "shared/abstract-api";
import {ExamType, ExamTypeService} from "./ExamType.Service";

const examTypeService = RelationManager.makeService<ExamType, ExamTypeService>(ExamTypeService);

export {ExamType, ExamTypeService, examTypeService};
