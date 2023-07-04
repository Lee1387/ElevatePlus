import { BitField, BitFieldResolvable, ColorResolvable, Guild, GuildMember, PermissionFlagsBits, Permissions, PermissionsBitField, Role, User } from "discord.js";
import ExtendedClient from "../../client/ExtendedClient";
import { Guild as DatabaseGuild, User as DatabaseUser } from "../../interfaces";
import { getGuild, getGuilds } from "../guild";
import { sendToDefaultChannel } from "../messages";
import { getUser } from "../user";
import Discord from "discord.js";

interface LevelTreshold {
    level: number;
    color: ColorResolvable;
    permissions: string[];
    position?: number;
}

const getLevelRoleTreshold = (level: number) => {
    const tresholds = require("./tresholds.json");

    let result = tresholds[0];
    tresholds.forEach((treshold: LevelTreshold) => {
        if(level >= treshold.level) {
            result = treshold;
        }
    });

    let position = tresholds.indexOf(result)+1;
    return {...result, position};
}

const getGuildTresholdRole = (guild: Guild, treshold: LevelTreshold) => {
    const levelRole = guild.roles.cache.find(role => role.name.includes("Level") && role.name.includes(treshold.level.toString()));
    if(!levelRole) return null;
    return levelRole;
}

const getLowestLevelRole = (guild: Guild) => {
    const levelRoles = guild.roles.cache.filter(role => role.name.includes("Level"));
    if(!levelRoles.size) return null;

    let lowestRole = levelRoles.first()!;
    levelRoles.forEach(role => {
        if(role.position < lowestRole.position) {
            lowestRole = role;
        }
    });

    return lowestRole;
}


const getMemberTresholdRole = (member: GuildMember) => {
    const levelRole = member.roles.cache.find(role => role.name.includes("Level"));
    if(!levelRole) return null;
    return levelRole;
}

const syncGuildLevelRoles = async (client: ExtendedClient, guild: Guild) => {
    const sourceGuild = await getGuild(guild) as DatabaseGuild;
    const levelRoles = guild.roles.cache.filter(role => role.name.includes("Level"));

    if(sourceGuild.levelRoles) {
        await assignLevelRolesInGuild(client, guild);
    } else {
        if(!levelRoles.size) return null;

        levelRoles.forEach(async (role: Role) => {
            try {
                await role.delete();
            } catch (e) {
                await sendToDefaultChannel(client, guild, client.i18n.__("roles.missingPermissions"));
            }
        });
    }
}

const syncGuildLevelRolesHoisting = async (client: ExtendedClient, guild: Guild) => {
    const sourceGuild = await getGuild(guild) as DatabaseGuild;
    const levelRoles = guild.roles.cache.filter(role => role.name.includes("Level"));
    if(!levelRoles.size) return null;

    levelRoles.forEach(async (role: Role) => {
        try {
            await role.setHoist(sourceGuild.levelRolesHoist);
        } catch (e) {
            await sendToDefaultChannel(client, guild, client.i18n.__("roles.missingPermissions"));
        }
    });
}

const assignUserLevelRole = async (client: ExtendedClient, user: User, guild: Guild) => {
    const sourceUser = await getUser(user) as DatabaseUser;
    if(!sourceUser) return null;

    const sourceGuild = await getGuild(guild) as DatabaseGuild;
    const member = await guild.members.fetch(user);
    const currentTresholdRole = await getMemberTresholdRole(member);
    const treshold = getLevelRoleTreshold(sourceUser.stats.level);
    let tresholdRole = await getGuildTresholdRole(guild, treshold);
    const lowestTresholdRole = await getLowestLevelRole(guild);

    if(currentTresholdRole) {
        if(tresholdRole && currentTresholdRole.equals(tresholdRole)) return null;

        try {
            await member.roles.remove(currentTresholdRole);
        } catch (error) {
            await sendToDefaultChannel(client, guild, client.i18n.__("roles.missingPermissions"));
            return null;
        }
    }

    if(!tresholdRole) {
        try {
            let position = treshold.position;
            if(lowestTresholdRole && treshold.position > lowestTresholdRole.position) {
                position = lowestTresholdRole.position-1;
            }
            tresholdRole = await guild.roles.create({
                name: `Level ${treshold.level}`,
                color: treshold.color,
                hoist: sourceGuild.levelRolesHoist,
                position: position
            });
        } catch (error) {
            await sendToDefaultChannel(client, guild, client.i18n.__("roles.missingPermissions"));
            return null;
        }
    }

    await sortLevelRoles(client, guild);
    try {
        await member.roles.add(tresholdRole);
    } catch (error) {
        await sendToDefaultChannel(client, guild, client.i18n.__("roles.missingPermissions"));
        return null;
    }
}

const sortLevelRoles = async (client: ExtendedClient, guild: Guild) => {
    const tresholds = require("./tresholds.json");
    const levelRoles = guild.roles.cache.filter(role => role.name.includes("Level"));
    if(!levelRoles.size) return null;

    levelRoles.forEach(async (role: Role) => {
        const level = role.name.split(" ")[1];
        const treshold = tresholds.find((treshold: LevelTreshold) => treshold.level == parseInt(level));
        if(!treshold) return null;

        try {
            await role.setPosition(treshold.position);
        } catch (error) {
            await sendToDefaultChannel(client, guild, client.i18n.__("roles.missingPermissions"));
        }
    });
}

const assignLevelRolesInGuild = async (client: ExtendedClient, guild: Guild) => {
    const sourceGuild = await getGuild(guild) as DatabaseGuild;
    if(!sourceGuild.levelRoles) return null;

    const members = await guild.members.fetch();
    for await (const member of members.values()) {
        const success = await assignUserLevelRole(client, member.user, guild);
        if(!success) continue;
    }
}

const assignLevelRolesInAllGuilds = async (client: ExtendedClient, user: User) => {
    const guilds = await getGuilds();

    for await(const sourceGuild of guilds) {
        const guild = await client.guilds.fetch(sourceGuild.guildId);
        if(!guild) continue;

        if(!guild.members.cache.has(user.id)) continue;
        if(!sourceGuild.levelRoles) continue;

        const success = await assignUserLevelRole(client, user, guild);
        if(!success) continue;
    }
};

export { assignUserLevelRole, assignLevelRolesInAllGuilds, syncGuildLevelRolesHoisting, assignLevelRolesInGuild, syncGuildLevelRoles, getLevelRoleTreshold };