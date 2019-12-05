import {timer} from "rxjs";
import {take} from "rxjs/operators";
import appTitle from "../../shared/lib-test";
import "../../theme/styles/base.scss";

timer(1000, 1000).pipe(
  take(5),
).subscribe(() => console.log(appTitle.name));

document.getElementById("app").innerHTML = "login";

const test1 = {toto: 1, titi: 2};
for (const i in test1) {
  console.log(i);
}

class Test {
}

const test2 = new Test();
