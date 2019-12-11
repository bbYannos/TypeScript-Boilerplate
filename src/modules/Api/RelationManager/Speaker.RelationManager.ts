import {AbstractRelationManager, OneToOneRelation} from "shared/abstract-api";
import {Speaker, SpeakerService} from "../Service/Speaker.Service";

export class SpeakerRelationManager extends AbstractRelationManager<Speaker> {
  protected Service = SpeakerService;
  protected oneToOneRelations: Array<OneToOneRelation<Speaker, any>> = [];
}
