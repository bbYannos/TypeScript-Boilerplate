import {AbstractRelationManager, OneToOneRelation, ServiceFactory} from "shared/abstract-api";
import {Formation} from "../Model/Formation.Model";
import {Trainee} from "../Model/Trainee.Model";
import {FormationService} from "../Service/Formation.Service";
import {TraineeService} from "../Service/Trainee.Service";

const formationRelation = new OneToOneRelation<Trainee, Formation>("formation", ServiceFactory.getService(FormationService));
formationRelation.debug = false;
export class TraineeRelationManager extends AbstractRelationManager<Trainee> {
  protected service = ServiceFactory.getService(TraineeService);
  protected oneToOneRelations = [formationRelation];
}

export const traineeRelationManager = new TraineeRelationManager();
traineeRelationManager.init();
