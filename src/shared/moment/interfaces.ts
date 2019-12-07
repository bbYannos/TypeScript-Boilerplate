import moment from "./moment";

export interface IdentifiedObjectInterface {
  uid?: number;
}

export interface PeriodInterface extends IdentifiedObjectInterface {
  startTime: moment.Moment;
  endTime: moment.Moment;
  color?: string;
}

export interface OperationInterface extends PeriodInterface {
  speaker: IdentifiedObjectInterface;
  event: EventInterface;

}

export interface EventInterface extends PeriodInterface {
  title: string;
  operations: OperationInterface[];
}


