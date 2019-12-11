import {AbstractRelationManager, OneToOneRelation} from "shared/abstract-api";
import {Formation, FormationService} from "../Service/Formation.Service";
import {Trainee, TraineeService} from "../Service/Trainee.Service";

const formationRelation = new OneToOneRelation<Trainee, Formation>("formation", FormationService);
formationRelation.debug = false;
export class TraineeRelationManager extends AbstractRelationManager<Trainee> {
  protected Service = TraineeService;
  protected oneToOneRelations = [formationRelation];
}
