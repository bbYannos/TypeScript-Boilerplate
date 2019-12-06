import {AbstractApiModel} from "shared/abstract-api";
import {JsonObject, JsonProperty} from "shared/json2typescript";

@JsonObject("Room")
export class Room extends AbstractApiModel {
    public constructorName = "Room";

    @JsonProperty("label", String)
    public label: string = "";
}
