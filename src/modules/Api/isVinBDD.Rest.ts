import {ApiRequestService} from "shared/abstract-api/rest/apiRequest.service";

export class IsVinRestBDD extends ApiRequestService {
    protected apiEndpointUrl = "/wp-json/isvin_extranet/v1/";
}
