import {DashboardLayout} from "./dashboard.layout";
const homeRoute = {path: "/home", name: "Accueil", meta: {icon: "fa-tachometer"}, component: DashboardLayout};

const absencesRoute = {path: "/absences", name: "Absences & Retards", meta: {icon: "fa-tachometer"}, component: DashboardLayout};



export {homeRoute};
