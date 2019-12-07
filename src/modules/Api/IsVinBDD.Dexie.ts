import {DexieRequestService} from "shared/abstract-api/dexie/dexieRequest.service";

export class IsVinDexieBDD extends DexieRequestService {
  public name = "IsVinDexie";
  public deleteOnInt = false;
  public stores = {
    absence: ["++dexieId", "trainee", "delay"].toString(),
    availability: ["++dexieId", "[parent+parentClass]", "[parent+parentClass+open]", "[parent+parentClass+open+global]", "[open+global]"].toString(),
    exam: ["++dexieId", "training"].toString(),
    exam_type: ["++dexieId"].toString(),
    exam_score: ["++dexieId", "trainee", "exam"].toString(),
    formation: ["++dexieId" ].toString(),
    module: ["++dexieId", "formation"].toString(),
    room: ["++dexieId"].toString(),
    speaker: ["++dexieId"].toString(),
    training: ["++dexieId", "formation", "speaker", "module"].toString(),
    trainee: ["++dexieId", "formation"].toString(),
    session: ["++dexieId", "training"].toString(),
    sessionExclusion: ["++dexieId", "session"].toString(),
  };
  protected _dbName: string = "IsVin";
}
