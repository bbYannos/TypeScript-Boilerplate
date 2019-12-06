import {AbstractApiModel} from "shared/abstract-api";
import {JsonObject, JsonProperty} from "shared/json2typescript";
@JsonObject("User")
export class User extends AbstractApiModel {
    public constructorName: string = "User";

    public get label() { return (this.lastName.length === 0) ? "" : this.lastName + " " + this.firstName; }

    @JsonProperty("lastName", String)
    public lastName: string = "";

    @JsonProperty("firstName", String)
    public firstName: string = "";

    public get shortName(): string {
        return this.firstName[0] + ". " + this.lastName;
    }

    @JsonProperty("email", String, true)
    public email: string = "";
}
