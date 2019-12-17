/* tslint:disable:max-classes-per-file */
import moment from "moment";
import {ObjectUtils} from "../utils/object.utils";
import {JsonConvert} from "./json-convert";
import {JsonConverter} from "./json-convert-decorators";
import {OperationMode, ValueCheckingMode} from "./json-convert-enums";
import {JsonCustomConvert} from "./json-custom-convert";

export const TIME_FORMAT = "HH:mm:ss";

@JsonConverter
export class MomentConverter implements JsonCustomConvert<moment.Moment> {
    public serialize(time: moment.Moment): string {
        if (ObjectUtils.isValidMoment(time)) {
            return time.format();
        }
        return null;
    }
    public deserialize(timeString: string): moment.Moment {
        return moment(timeString);
    }
}

@JsonConverter
export class TimeConverter implements JsonCustomConvert<moment.Moment> {
    public serialize(time: moment.Moment): string {
        if (moment.isMoment(time)) {
            return time.format(TIME_FORMAT);
        }
        return "";
    }
    public deserialize(timeString: string): moment.Moment {
        return moment(timeString, TIME_FORMAT);
    }
}

@JsonConverter
export class DurationConverter implements JsonCustomConvert<moment.Duration> {
    public serialize(duration: moment.Duration): string {
        if (moment.isDuration(duration)) {
            return duration.asMilliseconds().toString();
        }
        return Number(0).toString();
    }
    public deserialize(durationString: string): moment.Duration {
        return moment.duration(Number(durationString));
    }
}

interface IdentifiedObjectInterface {
    identifier: string;
}
@JsonConverter
export class RelationConverter implements JsonCustomConvert<IdentifiedObjectInterface> {
    public serialize(object: IdentifiedObjectInterface): string {
        return object.identifier;
    }
    public deserialize(identifier: string | number): IdentifiedObjectInterface {
        if (typeof(identifier)  === "number") {
            identifier = "api_" + identifier.toString();
        }
        return { identifier: identifier.toString() };
    }
}

@JsonConverter
export class BooleanConverter implements JsonCustomConvert<boolean> {
    public serialize(value: boolean): number {
        return (value) ? 1 : 0;
    }
    public deserialize(value: number): boolean {
        if (typeof (value) !== "number") {
            alert ("BOOL is not a number !");
        }
        return (value === 1);
    }
}

export class JsonMapper<T> {
    public jsonConvert: JsonConvert = new JsonConvert();

    constructor() {
        this.jsonConvert.operationMode = OperationMode.ENABLE;
        this.jsonConvert.ignorePrimitiveChecks = false;
        this.jsonConvert.valueCheckingMode = ValueCheckingMode.ALLOW_NULL;
    }

    public createFromJson(json, ConstructorFn): T {
        return this.jsonConvert.deserializeObject(json, ConstructorFn);
    }

    public updateFromJson(json, instance): T {
        return this.jsonConvert.deserializeAndUpdateObject(json, instance);
    }

    public toJson(object: T): any {
        return this.jsonConvert.serialize(object);
    }
}
