import {RelationManager} from "shared/abstract-api";
import {Speaker, SpeakerService} from "./Speaker.Service";

const speakerService = RelationManager.makeService<Speaker, SpeakerService>(SpeakerService);
export {Speaker, SpeakerService, speakerService};
// speakerService.repository.debug = true;
