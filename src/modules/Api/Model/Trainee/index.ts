import {OneToOneRelation, RelationManager} from "shared/abstract-api";
import {Formation, formationService} from "../Formation";
import {Trainee, TraineeService} from "./Trainee.Service";

const traineeService = RelationManager.makeService(TraineeService, [
  new OneToOneRelation<Trainee, Formation>("formation", formationService),
]);
export {Trainee, TraineeService, traineeService};

