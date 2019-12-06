import "assets/base";
import {timer} from "rxjs";
import {take} from "rxjs/operators";
import appTitle from "shared/lib-test";

timer(1000, 1000).pipe(
  take(5),
).subscribe(() => console.log(appTitle.name));

const $app = document.getElementById("app");

if ($app !== null) {
  $app.innerHTML = "login";
}

const test1 = {toto: 1, tata: 2};
for (const i in test1) {
  console.log(i);
}

class Test {

}
const test8 = new Test();
