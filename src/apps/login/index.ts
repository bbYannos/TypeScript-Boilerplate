import "assets/base";

const $app = document.getElementById("app");

if ($app !== null) {
  $app.innerHTML = "login";
}

const test1 = {toto: 1, tata: 2};
for (const i in test1) {
  console.log(i);
}
