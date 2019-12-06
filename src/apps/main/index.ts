import "assets/main";
import moment from "shared/moment/moment";

const $app = document.getElementById("app");
if ($app !== null) {
  $app.innerHTML = moment().format("HH:mm");
}
