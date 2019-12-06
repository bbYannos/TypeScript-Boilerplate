import moment from "moment";
import "moment-duration-format";
// avoid all locales in webpack.config :
// new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
// and load wanted locale
import "moment/locale/fr.js";
moment.locale("fr");
export default moment;
