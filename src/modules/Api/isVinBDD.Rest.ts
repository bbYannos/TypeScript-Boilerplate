import {ApiRequestService} from "shared/abstract-api";

export class IsVinRestBDD extends ApiRequestService {
    protected apiEndpointUrl = '/wp-json/isvin_extranet/v1/';
}
