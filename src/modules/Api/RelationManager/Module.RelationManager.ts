import {AbstractRelationManager, ChildrenListDefinition, OneToParentRelation} from "shared/abstract-api";
import {Formation, formationService, Module, ModuleQuery, moduleService} from "../Service";
import {formationRelationManager} from "./Formation.RelationManager";

const formationRelation = new OneToParentRelation<Module, Formation>("formation", "modules$", formationService);
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
