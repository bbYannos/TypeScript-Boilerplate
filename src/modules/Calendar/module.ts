// https://github.com/webpack/webpack/issues/7378
import {OptionsInput as _OI} from "@fullcalendar/core";
type OptionsInput = _OI;
export {OptionsInput};




import "@fullcalendar/core/main.css";
import "@fullcalendar/timegrid/main.css";
import "assets/styles/overrides/full-calendar.scss";


export * from "modules/Calendar/FullCalendar";
export * from "modules/Calendar/FullCalendarEditable";
export * from "./Calendar.Factory";
