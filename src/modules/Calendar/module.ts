// https://github.com/webpack/webpack/issues/7378
import {OptionsInput as _OI} from "@fullcalendar/core";
import "@fullcalendar/core/main.css";
import "@fullcalendar/timegrid/main.css";
import "assets/styles/overrides/full-calendar.scss";

type OptionsInput = _OI;
export {OptionsInput};

export {FullCalendar} from "modules/Calendar/FullCalendar";
export {EditableFullCalendar} from "modules/Calendar/FullCalendarEditable";
export {CalendarFactory} from "./Calendar.Factory";
