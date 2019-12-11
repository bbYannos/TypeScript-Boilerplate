import {
  AbstractRelationManager,
  ChildrenListDefinition,
  OneToParentRelation,
  ServiceFactory,
} from "shared/abstract-api";
import {Formation, FormationService} from "../Service/Formation.Service";
import {Module, ModuleQuery, ModuleService} from "../Service/Module.Service";
import {formationRelationManager} from "./Formation.RelationManager";

const moduleService = ServiceFactory.getService(ModuleService);
const formationRelation = new OneToParentRelation<Module, Formation>("formation", "modules$", FormationService);
formationRelationManager.childrenListDefinitions.push({
  propertyName: "modules$",
  defaultSource$: (object) => {
    const query = new ModuleQuery();
    query.formation = object;
    return moduleService.list(query);
  },
  jsonKey: "modules",
  service: moduleService,
} as ChildrenListDefinition<Formation, Module>);

export class ModuleRelationManager extends AbstractRelationManager<Module> {
  protected Service = ModuleService;
  protected oneToOneRelations = [formationRelation];
}

