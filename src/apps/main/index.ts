import "../../theme/styles/main.scss";
import {timer} from "rxjs";
import {take} from "rxjs/operators";
import appTitle from "../../shared/lib-test";
import mainContent from "../../shared/lib-other";

timer(1000, 1000).pipe(
  take(5)
).subscribe(() => console.log(appTitle.name));
document.getElementById('app').innerHTML = mainContent.home;