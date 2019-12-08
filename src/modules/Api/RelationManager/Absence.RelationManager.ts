import {AbstractRelationManager, OneToParentRelation, ServiceFactory} from "shared/abstract-api";
import {Absence, AbsenceService} from "../Service/Absence.Service";
import {Trainee, TraineeService} from "../Service/Trainee.Service";
import {traineeRelationManager} from "./Trainee.RelationManager";

const absenceService = ServiceFactory.getService(AbsenceService);

const traineeRelation = new OneToParentRelation<Absence, Trainee>("trainee", "allAbsences$", TraineeService);
traineeRelationManager.childrenListDefinitions.push({
    propertyName: "allAbsences$",
    defaultSource$: (object) => absenceService.getByTrainee(object),
    jsonKey: "absences",
    service: absenceService,
});

export class AbsenceRelationManager extends AbstractRelationManager<Absence> {
  protected Service = AbsenceService;
  protected oneToOneRelations = [traineeRelation];
}

export const absenceRelationManager = new AbsenceRelationManager();
absenceRelationManager.debug = false;
absenceRelationManager.init();
