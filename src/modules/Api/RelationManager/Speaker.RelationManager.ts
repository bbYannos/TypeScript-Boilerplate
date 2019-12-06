import {AbstractRelationManager, OneToOneRelation} from "shared/abstract-api";
import {Speaker, speakerService} from "../Service";

export class SpeakerRelationManager extends AbstractRelationManager<Speaker> {
  protected service = speakerService;
  protected oneToOneRelations: Array<OneToOneRelation<Speaker, any>> = [];
}
export const speakerRelationManager = new SpeakerRelationManager();
speakerRelationManager.init();
speakerRelationManager.debug = false;
