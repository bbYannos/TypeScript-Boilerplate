import {ApiRequestService} from "shared/abstract-api/rest/apiRequest.service";
import {__API__} from "./ApiConstants";

export class IsVinRestBDD extends ApiRequestService {
    public authEndPoint = __API__ + "/wp-json/jwt-auth/v1/";
    public apiEndpointUrl = __API__ + "/wp-json/isvin_extranet/v1/";
}
