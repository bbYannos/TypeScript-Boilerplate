import "datatables.net";
import "datatables.net-bs4/css/dataTables.bootstrap4.css";
import $ from "jquery";
import {ObjectUtils} from "shared/utils/object.utils";
import {Column} from "./models/Column";
import {DataTableBase} from "./models/DataTable.Base";
import {DataTableEditable} from "./models/DataTable.Editable";
import "./style.scss";

// moment columns sorting
$.fn.dataTable.ext.order["dom-moment"] = function(settings, col) {
  return this.api().column(col, {order: "index"}).nodes().map((td: HTMLTableCellElement) => {
    if (ObjectUtils.isValidMoment(this.api().cell(td).data())) {
      return this.api().cell(td).data().format();
    } else {
      return null;
    }
  });
};

export {DataTableEditable, DataTableBase, Column};
