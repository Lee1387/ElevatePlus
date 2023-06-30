import { GuildMember } from "discord.js";
import { Event } from "../interfaces";
import { endVoiceActivity } from "../modules/activity";
import { getGuild } from "../modules/guild";
import { sweepTextChannel } from "../modules/messages";

export const voiceChannelLeave: Event = {
    name: "voiceChannelLeave",
    run: async (client, member, channel) => {
        await endVoiceActivity(client, member);

        const sourceGuild = await getGuild(channel.guild);
        if(!sourceGuild) return;

        const defaultChannel = channel.guild.channels.cache.get(sourceGuild.channelId);
        if(!defaultChannel) return;

        if(channel.members.size == 0) {
            await sweepTextChannel(client, channel.guild, channel);
        }

        const guildActiveUsers = member.guild.members.cache.filter((member: GuildMember) => member.voice.channel).size;
        if(guildActiveUsers == 0) {
            await sweepTextChannel(client, channel.guild, defaultChannel);
        }
    }
}