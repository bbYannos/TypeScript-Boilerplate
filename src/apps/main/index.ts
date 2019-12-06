import "assets/main";
import {timer} from "rxjs";
import {take} from "rxjs/operators";
import mainContent from "shared/lib-other";
import appTitle from "shared/lib-test";

timer(1000, 1000).pipe(
  take(5)
).subscribe(() => console.log(appTitle.name));

const $app = document.getElementById("app");
if ($app !== null) {
  $app.innerHTML = mainContent.home;
}
