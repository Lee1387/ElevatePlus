import { Interaction } from "../../interfaces/Interaction"
import { ButtonInteraction } from "discord.js";
import { sendConfigMessage } from "../../modules/messages";
import { setLocale } from "../../modules/locale";

const pl: Interaction = {
    customId: `pl`,
    run: async (client, interaction) => {
        if(!(interaction instanceof ButtonInteraction)) return;

        if(interaction.guild?.ownerId != interaction.user.id) {
            interaction.reply({ content: client.i18n.__("utils.noPermissions"), ephemeral: true });
            return;
        }
        interaction.message.delete();
        const locale = pl.customId.toLowerCase();
        client.i18n.setLocale(locale);
        await setLocale(interaction.guild, locale);
        await sendConfigMessage(client, interaction.guild!);
    }
}

export default pl;