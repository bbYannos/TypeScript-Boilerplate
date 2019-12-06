import {DexieRestService, Repository} from "shared/abstract-api";
import {Room} from "../Model";

export {Room};

export class RoomService extends DexieRestService<Room> {
    public repository = new Repository<Room>(Room);
}
export const roomService = new RoomService();
