import {OneToParentRelation, RelationManager} from "shared/abstract-api";
import {Trainee, traineeService} from "../Trainee";
import {Absence, AbsenceService} from "./Absence.Service";

const absenceService = RelationManager.makeService(AbsenceService,  [
    new OneToParentRelation<Absence, Trainee>("trainee", "allAbsences$", traineeService),
]);

traineeService.repository.relationManager.childrenListDefinitions.push({
    propertyName: "allAbsences$",
    defaultSource$: (object) => absenceService.getByTrainee(object),
    jsonKey: "absences",
    service: absenceService,
});

export {Absence, AbsenceService, absenceService};
