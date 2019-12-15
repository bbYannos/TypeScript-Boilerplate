import Vue from "vue";
import Component from "vue-class-component";
import WithRender from "./app.html";

@WithRender
@Component
export class App extends Vue {}
