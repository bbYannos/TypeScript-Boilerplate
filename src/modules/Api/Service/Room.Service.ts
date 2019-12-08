import {DexieRestService, Repository} from "shared/abstract-api";
import {Room} from "../Model/Room.Model";


export class RoomService extends DexieRestService<Room> {
    public repository = new Repository<Room>(Room);
}
