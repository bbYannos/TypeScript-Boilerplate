import {RelationManager} from "shared/abstract-api";
import {Speaker, SpeakerService} from "./Speaker.Service";

const speakerService = new SpeakerService();
// tslint:disable-next-line:no-unused-expression
new RelationManager(speakerService);
export {Speaker, SpeakerService, speakerService};
