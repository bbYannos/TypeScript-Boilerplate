import moment from "shared/moment";

export const MODULES_CONSTANTS = {
    SCHEDULE: {
        OPENING: moment().hour(8).startOf("hour"),
        CLOSING: moment().hour(19).startOf("hour"),
    },
};
