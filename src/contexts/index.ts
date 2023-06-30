import { ContextMenu } from "../interfaces";
import userContext from "./userContext";
import guildStatisticsContext from "./guildStatisticsContext";

const contexts: ContextMenu[] = [
    userContext,
    guildStatisticsContext
];

export default contexts;