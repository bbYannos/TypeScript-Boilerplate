import "assets/styles/form.scss";
import $ from "jquery";
import {Formation} from "modules/Api/Model/Formation";
import {DATE_FORMAT, EDITABLE_TYPES, TIME_FORMAT} from "modules/DataTable/Constants";
import {EditableContentManager} from "modules/DataTable/models/Inputs/EditableContent.manager";
import {tap} from "rxjs/operators";
import Vue from "vue";
import Component from "vue-class-component";
import {Store} from "../_store";
import {FormEditable} from "./form.editable";
import WithRender from "./formation.form.html";

@WithRender
@Component({components: {FormEditable}})
export class FormationForm extends Vue {
  public data: {
    formation: Formation,
    TIME_FORMAT: string,
    DATE_FORMAT: string,
    EDITABLE_TYPES: any,
  } = {
    formation: null,
    TIME_FORMAT: TIME_FORMAT,
    DATE_FORMAT: DATE_FORMAT,
    EDITABLE_TYPES: EDITABLE_TYPES,
  };

  public mounted() {
    Store.formation_.subscribe((formation: Formation) => this.data.formation = formation);
  }

  public update(property: keyof Formation, value: any) {
    // @ts-ignore
    this.data.formation[property] = value;
    Store.formation_.next(this.data.formation);
  }

}

export default Vue.component("formation-form", FormationForm);
