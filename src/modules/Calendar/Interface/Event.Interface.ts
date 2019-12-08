import moment from "shared/moment";

export interface EventInterface {
  label: string;
  color?: string;
  startTime: moment.Moment;
  endTime: moment.Moment;

  moveStartTime(qty: number, unit?: moment.unitOfTime.Diff);

  moveEndTime(qty: number, unit?: moment.unitOfTime.Diff);
}

