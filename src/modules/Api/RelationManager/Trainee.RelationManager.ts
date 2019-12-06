import {AbstractRelationManager, OneToOneRelation} from "shared/abstract-api";
import {Formation, formationService, Trainee, traineeService} from "../Service";

const formationRelation = new OneToOneRelation<Trainee, Formation>("formation", formationService);
formationRelation.debug = false;
export class TraineeRelationManager extends AbstractRelationManager<Trainee> {
  protected service = traineeService;
  protected oneToOneRelations = [formationRelation];
}

export const traineeRelationManager = new TraineeRelationManager();
traineeRelationManager.init();
