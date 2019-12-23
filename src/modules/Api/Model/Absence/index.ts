import {OneToParentRelation, RelationManager} from "shared/abstract-api";
import {Trainee, traineeService} from "../Trainee";
import {Absence, AbsenceService} from "./Absence.Service";

const absenceToTraineeRelation = new OneToParentRelation<Absence, Trainee>("trainee", "allAbsences$", traineeService);
absenceToTraineeRelation.watchedProperties = ["justified", "duration"];

const absenceService = RelationManager.makeService(AbsenceService,  [
    absenceToTraineeRelation,
]);

traineeService.repository.relationManager.childrenListDefinitions.push({
    propertyName: "allAbsences$",
    defaultSource$: (object) => absenceService.getByTrainee(object),
    jsonKey: "absences",
    service: absenceService,
});

export {Absence, AbsenceService, absenceService};
