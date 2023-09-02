import { Guild, TextChannel, User } from "discord.js";
import ExtendedClient from "../client/ExtendedClient";
import { Event } from "../interfaces";
import { getGuild } from "../modules/guild";
import { getDailyRewardMessagePayload } from "../modules/messages";


export const userReceivedDailyReward: Event = {
    name: "userReceivedDailyReward",
    run: async (client: ExtendedClient, user: User, guild: Guild, next: number) => {
        const sourceGuild = await getGuild(guild);
        if(!sourceGuild || !sourceGuild.channelId || !sourceGuild.notifications) return;

        const defaultChannel = guild.channels.cache.get(sourceGuild.channelId) as TextChannel;
        if(!defaultChannel) return;

        const dailyRewardMessagePayload = await getDailyRewardMessagePayload(client, user, guild, next);
        
        try {
            await defaultChannel.send(dailyRewardMessagePayload);
        } catch (error) {
            console.log(error);
        }
    }
}