import {AbstractRelationManager, OneToParentRelation} from "shared/abstract-api";
import {Absence, absenceService, Trainee, traineeService} from "../Service";
import {traineeRelationManager} from "./Trainee.RelationManager";

const traineeRelation = new OneToParentRelation<Absence, Trainee>("trainee", "allAbsences$", traineeService);
traineeRelationManager.childrenListDefinitions.push({
    propertyName: "allAbsences$",
    defaultSource$: (object) => absenceService.getByTrainee(object),
    jsonKey: "absences",
    service: absenceService,
});

export class AbsenceRelationManager extends AbstractRelationManager<Absence> {
  protected service = absenceService;
  protected oneToOneRelations = [traineeRelation];
}

export const absenceRelationManager = new AbsenceRelationManager();
absenceRelationManager.debug = false;
absenceRelationManager.init();
