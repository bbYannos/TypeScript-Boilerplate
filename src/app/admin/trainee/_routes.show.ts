import {RouteConfig} from "vue-router";

const Foo = {template: "<h1>{{$route.name}}</h1>"};

export const traineeRoutes: RouteConfig[] = [{
  path: "scores", name: "Notes",
  meta: {icon: "fa-star-o"},
  component: Foo,
}, {
  path: "absences", name: "Absences",
  meta: {icon: "fa-clock-o"},
  component: Foo,
},
];
