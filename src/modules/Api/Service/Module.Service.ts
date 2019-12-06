import {Observable} from "rxjs";
import {AbstractApiQuery, DexieRestService, Repository} from "shared/abstract-api";
import {Formation, Module} from "../Model";

export {Module};

export class ModuleQuery extends AbstractApiQuery<Module> {
  public formation: Formation = null;
  protected equals = ["formation"];
}

export class ModuleService extends DexieRestService<Module> {
  public repository: Repository<Module> = new Repository<Module>(Module);

  public createByQuery(query: ModuleQuery): Observable<Module> {
    const module = this.repository.makeNew();
    module.formation = query.formation;
    return super.create(module);
  }
}

export const moduleService = new ModuleService();
