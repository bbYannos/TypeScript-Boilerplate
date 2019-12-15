import Api from "modules/Api/Api.module";
import {Speaker} from "modules/Api/Model/Speaker";
import {SpeakersList} from "./list.layout";
import {SpeakerShow} from "./show.layout";

const speakerRoute = {
  path: ":identifier", name: "Speaker", component: SpeakerShow, meta: {
    elements: [],
  },
};

export const speakersRoute = {
  path: "/speakers",
  name: "Intervenants",
  meta: {icon: "fa-user"},
  redirect: "/speakers/list",
  component: {template: "<router-view />"},
  children: [
    {path: "list", name: "SpeakersList", component: SpeakersList},
    speakerRoute,
  ],
};

Api.speakerService.fetchAll$.subscribe((speakers: Speaker[]) => {
  speakerRoute.meta.elements = speakers;
});
