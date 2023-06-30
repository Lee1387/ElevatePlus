import { ContextMenu } from "../interfaces";
import profileContext from "./profileContext";
import guildStatisticsContext from "./guildStatisticsContext";
import sweepContext from "./sweepContext";

const contexts: ContextMenu[] = [
    profileContext,
    guildStatisticsContext,
    sweepContext
];

export default contexts;