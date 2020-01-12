import "assets/styles/form.scss";
import {FormEditable} from "components/forms/form.editable";
import {Formation} from "modules/Api/Model/Formation";
import {DATE_FORMAT, EDITABLE_TYPES, TIME_FORMAT} from "modules/DataTable/Constants";
import {Component, Vue, VueComponent} from "shared/vue";
import {Store} from "../../_store";
import WithRender from "./formation.form.html";

@WithRender
@Component({components: {FormEditable}})
export class FormationForm extends Vue implements VueComponent {
  public data: {
    TIME_FORMAT: string,
    DATE_FORMAT: string,
    EDITABLE_TYPES: any,
  } = {
    TIME_FORMAT: TIME_FORMAT,
    DATE_FORMAT: DATE_FORMAT,
    EDITABLE_TYPES: EDITABLE_TYPES,
  };

  public formation: Formation = null;

  public mounted() {
    Store.formation_.subscribe((formation: Formation) => {
      this.formation = formation;
      this.$forceUpdate();
    });
  }

  public update(property: keyof Formation, value: any) {
    // @ts-ignore
    this.formation[property] = value;
    Store.formation_.next(this.formation);
  }
}

export default Vue.component("formation-form", FormationForm);
