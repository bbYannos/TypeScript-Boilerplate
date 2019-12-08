import {
  AbstractRelationManager,
  ChildrenListDefinition,
  OneToParentRelation,
  ServiceFactory,
} from "shared/abstract-api";
import {Formation} from "../Model/Formation.Model";
import {Module} from "../Model/Module.Model";
import {FormationService} from "../Service/Formation.Service";
import {ModuleQuery, ModuleService} from "../Service/Module.Service";
import {formationRelationManager} from "./Formation.RelationManager";

const moduleService = ServiceFactory.getService(ModuleService);
const formationRelation = new OneToParentRelation<Module, Formation>("formation", "modules$", ServiceFactory.getService(FormationService));
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
  protected service = moduleService;
  protected oneToOneRelations = [formationRelation];
}

export const moduleRelationManager = new ModuleRelationManager();
moduleRelationManager.init();
moduleRelationManager.debug = false;
