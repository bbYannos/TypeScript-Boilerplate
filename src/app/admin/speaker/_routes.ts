import Api from "modules/Api/Api.module";
import {Speaker} from "modules/Api/Model/Speaker";
import {speakerRoutes} from "./_routes.show";
import {SpeakersList} from "./list.layout";
import {SpeakerShow} from "./show.layout";

let currentRoute = speakerRoutes[0].path;
speakerRoutes.forEach((_route) => {
  _route.beforeEnter = (to, from, next) => {
    currentRoute = _route.path;
    next();
  };
});


const speakerRoute = {
  path: ":identifier",
  redirect: () => {
    return ":identifier/" + currentRoute;
  },
  component: SpeakerShow,
  meta: {
    elements: [],
  },
  children: speakerRoutes,
};

export const speakersRoute = {
  path: "/speakers", redirect: "/speakers/list",
  meta: {
    icon: "fa-user",
    label: "Intervenants",
  },
  component: {template: "<router-view />"},
  children: [
    {path: "list", name: "SpeakersList", component: SpeakersList},
    speakerRoute,
  ],
};

Api.speakerService.fetchAll$.subscribe((speakers: Speaker[]) => {
  speakerRoute.meta.elements = speakers;
});
