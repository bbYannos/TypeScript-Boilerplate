import {ChildrenListDefinition, OneToParentRelation, RelationManager} from "shared/abstract-api";
import {Formation, formationService} from "../Formation";
import {Module, ModuleQuery, ModuleService} from "./Module.Service";

const moduleService = RelationManager.makeService(ModuleService, [
  new OneToParentRelation<Module, Formation>("formation", "modules$", formationService)
]);

formationService.repository.relationManager.childrenListDefinitions.push({
  propertyName: "modules$",
  defaultSource$: (object) => {
    const query = new ModuleQuery();
    query.formation = object;
    return moduleService.list(query);
  },
  jsonKey: "modules",
  service: moduleService,
} as ChildrenListDefinition<Formation, Module>);

export {Module, ModuleQuery, ModuleService, moduleService};
