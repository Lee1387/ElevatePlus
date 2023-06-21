import { Schema } from "mongoose";
import { Guild } from "../../interfaces";

const channelId = { type: String, default: null };
const reqString = { type: String, required: true };

const guildSchema = new Schema<Guild>({
    guildId: reqString,
    channelId: channelId,
    locale: { type: String, default: "en" }
});

export default guildSchema;