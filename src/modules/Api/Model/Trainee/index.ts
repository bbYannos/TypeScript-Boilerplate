import {OneToOneRelation, RelationManager} from "shared/abstract-api";
import {Formation, formationService} from "../Formation";
import {Trainee, TraineeService} from "./Trainee.Service";

const traineeService = new TraineeService();
const relationManager = new RelationManager(traineeService);
relationManager.oneToOneRelations = [
  new OneToOneRelation<Trainee, Formation>("formation", formationService),
];

export {Trainee, TraineeService, traineeService};

