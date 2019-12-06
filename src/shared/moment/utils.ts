import {PeriodInterface} from "./interfaces";
import moment from "./moment";

export function getTemplateDay(dayNum: number) {
  return moment().year(1970).startOf("year").add(1, "week").startOf("week").isoWeekday(dayNum);
}

export function adjustWeekOfPeriodToOtherPeriod(period1: PeriodInterface, period2: PeriodInterface) {
  period1.startTime = adjustWeekOfMomentToOtherMoment(period1.startTime, period2.startTime);
  period1.endTime = adjustWeekOfMomentToOtherMoment(period1.endTime, period2.endTime);
}

export function adjustWeekOfMomentToOtherMoment(moment1: moment.Moment, moment2: moment.Moment) {
  return moment2.clone().startOf("week").isoWeekday(moment1.isoWeekday())
  .hour(moment1.hour()).minute(moment1.minute()).second(moment1.second()).millisecond(moment1.millisecond());
}
