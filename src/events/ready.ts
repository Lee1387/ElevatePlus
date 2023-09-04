import ExtendedClient from "../client/ExtendedClient";
import { Event } from "../interfaces";
import { REST, RESTPostAPIApplicationCommandsJSONBody, Routes, TextChannel } from "discord.js";
import { updatePresence } from "../modules/presence/";

import config from "../utils/config";

const restPutRes = async (client: ExtendedClient) => {
    const rest = new REST({ version: "10" }).setToken(config.token);
    const commandsData = client.commands.map(command => command.data.toJSON()) as RESTPostAPIApplicationCommandsJSONBody[];;
    const contextsData = client.contexts.map(context => context.data.toJSON()) as RESTPostAPIApplicationCommandsJSONBody[];;
    const data = commandsData.concat(contextsData) as RESTPostAPIApplicationCommandsJSONBody[];

    await rest.put(
        Routes.applicationCommands(config.clientId),
        {
            body: data
        },
    );
}


export const ready: Event = {
    name: "ready",
    run: async (client) => {
        console.log(`[ready] Logged in as`, client.user?.tag);
        console.log(`[ready] Serving`, client.guilds.cache.size, `guilds`);

        console.log(client.guilds.cache.map(g => ({size: g.members.cache.size, name: g.name})).sort((a, b) => b.size - a.size).slice(0, 10));

        await updatePresence(client);
        //await restPutRes(client);
    }
}