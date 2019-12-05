import "../../theme/styles/base.scss";
import {timer} from "rxjs";
import {take} from "rxjs/operators";
import appTitle from "../../shared/lib-test";
timer(1000, 1000).pipe(
  take(5)
).subscribe(() => console.log(appTitle.name));
document.getElementById('app').innerHTML = 'login';