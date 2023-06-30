import { Event } from "../interfaces";

export const error: Event = {
    name: "error",
    run: async (client, error) => {
        console.log("[Error] encountered an error: ", error);
    }
}