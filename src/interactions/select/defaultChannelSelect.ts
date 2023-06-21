import { PermissionFlagsBits, StringSelectMenuInteraction } from "discord.js";
import { Interaction } from "../../interfaces";
import { setDefaultChannelId } from "../../modules/guild";
import { withGuildLocale } from "../../modules/locale";
import { getConfigMessagePayload } from "../../modules/messages";

export const defaultChannelSelect: Interaction = {
    customId: "defaultChannelSelect",
    permissions: [PermissionFlagsBits.Administrator],
    run: async (client, interaction) => {
        if(!(interaction instanceof StringSelectMenuInteraction)) return;

        const guild = interaction.guild;
        const selected = interaction.values[0];
        withGuildLocale(client, guild);

        await setDefaultChannelId(guild, selected);

        const configMessage = await getConfigMessagePayload(client, interaction.guild!);
        await interaction.update(configMessage!);
    }
}