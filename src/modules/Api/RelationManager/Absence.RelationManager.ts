import {AbstractRelationManager, OneToParentRelation, ServiceFactory} from "shared/abstract-api";
import {Absence} from "../Model/Absence.Model";
import {Trainee} from "../Model/Trainee.Model";
import {AbsenceService} from "../Service/Absence.Service";
import {TraineeService} from "../Service/Trainee.Service";
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
