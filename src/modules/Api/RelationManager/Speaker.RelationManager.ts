import {AbstractRelationManager, OneToOneRelation, ServiceFactory} from "shared/abstract-api";
import {Speaker} from "../Model/Speaker.Model";
import {SpeakerService} from "../Service/Speaker.Service";

export class SpeakerRelationManager extends AbstractRelationManager<Speaker> {
  protected service = ServiceFactory.getService(SpeakerService);
  protected oneToOneRelations: Array<OneToOneRelation<Speaker, any>> = [];
}
export const speakerRelationManager = new SpeakerRelationManager();
speakerRelationManager.init();
speakerRelationManager.debug = false;
