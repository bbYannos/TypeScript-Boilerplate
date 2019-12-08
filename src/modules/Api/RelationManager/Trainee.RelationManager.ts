import {AbstractRelationManager, OneToOneRelation} from "shared/abstract-api";
import {Formation} from "../Model/Formation.Model";
import {Trainee} from "../Model/Trainee.Model";
import {FormationService} from "../Service/Formation.Service";
import {TraineeService} from "../Service/Trainee.Service";

const formationRelation = new OneToOneRelation<Trainee, Formation>("formation", FormationService);
formationRelation.debug = false;
export class TraineeRelationManager extends AbstractRelationManager<Trainee> {
  protected Service = TraineeService;
  protected oneToOneRelations = [formationRelation];
}

export const traineeRelationManager = new TraineeRelationManager();
traineeRelationManager.init();
